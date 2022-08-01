import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import {registerValidation,loginValidation,postCreateValidation} from './validations.js'

import checkAuth from './utils/checkAuth.js';

import {UserController,PostController} from './contollerers/index.js'


import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
    .connect('mongodb+srv://admin:6kqx1c5juH31g5@cluster0.4ennp.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Database OK'))
    .catch((err) => console.log('Data base ERROR', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_,__,cb ) =>{
        cb(null, 'upload');
},
    filename: (_,file,cb ) =>{
        cb(null, file.originalname);
},

});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/upload',express.static('upload'));

app.post('/auth/login',loginValidation,handleValidationErrors,UserController.login);
app.post('/auth/register',registerValidation,handleValidationErrors, UserController.register);
app.get('/auth/me',checkAuth, UserController.getMe);

app.post('/upload',checkAuth,upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth,postCreateValidation,handleValidationErrors,PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id',checkAuth, postCreateValidation,handleValidationErrors,PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK');
});