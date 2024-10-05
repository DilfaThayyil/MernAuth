import express from 'express'
import { deleteUser, getUsers, login } from '../controller/admin.controller.js'


const router = express.Router()

router.post('/login',login)
router.post('/users',getUsers)

export default router