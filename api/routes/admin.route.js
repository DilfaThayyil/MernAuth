import express from 'express';
import { deleteUser, getUsers, login, updateuser, createUsers } from '../controller/admin.controller.js';


const router = express.Router()

router.post('/login',login)
router.post('/users',getUsers)
router.post('/createUsers',createUsers)
router.put('/users/:id',updateuser)
router.delete('/users/:id',deleteUser)

export default router