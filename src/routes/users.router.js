import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import UserDTO from '../dao/DTOs/user.dto.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
import userModel from '../dao/mongo/models/userModel.js';
import { generateToken, PRIVATE_KEY } from '../utils/utils.js';

const router = Router();
const usersRouter = router;

const UC = new UserController();

router.post("/register", passport.authenticate('register',{failureRedirect:'/failregister'}) ,async (req, res) => {
    res.redirect('/')
});
router.get('/failregister', async(req,res)=> {
    console.log("Registro erroneo");
    res.send({error:"Failed"})
})

router.post("/login", passport.authenticate('login',{failureRedirect:'/faillogin'}) ,async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
});
router.get("/faillogin", async(req,res) => {
    console.log("Ingreso erroneo");
    res.send({error:"Failed"})
})

router.get('/github', passport.authenticate('github',{scope:['user:email']}),async(req,res) => {});
router.get('/githubcallback',passport.authenticate('github',{failureRedirect: '/login'}), async(req,res) =>{
    res.redirect('/');
})

router.get('/current', auth, async (req, res) => {
    try {
        const uid = req.user._id
        const user = await UC.getById(uid);
        if (user) {
            const userDTO = new UserDTO(user);
            res.json(userDTO);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

router.post('/premium/:uid', auth, isAdmin, async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = user.role === 'premium' ? 'user' : 'premium';
        await user.save();

        res.status(200).json({ message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const token = generateToken({ email: user.email });

        res.send('Correo de reseteo de contraseña enviado');
    } catch (error) {
        console.error("Error al enviar el correo de reseteo de contraseña:", error);
        res.status(500).send('Error al enviar el correo de reseteo de contraseña');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);

        const user = await userModel.findOne({ email: decoded.user.email });

        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        user.password = newPassword;
        await user.save();

        res.send('Contraseña actualizada correctamente');
    } catch (error) {
        console.error("Error al resetear la contraseña:", error);
        return res.status(400).send('Token inválido o expirado');
    }
});

export default usersRouter;