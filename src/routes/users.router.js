import {Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import UserDTO from '../dao/DTOs/user.dto.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
import userModel from '../dao/mongo/models/userModel.js';
import { generateToken, PRIVATE_KEY } from '../utils/utils.js';
import { sendDeletionEmail } from '../services/emailService.js';

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
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),(req, res) => {
    console.log('User authenticated:', req.user);
    res.redirect('/')
});

router.post('/logout', async (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }
            res.redirect('/login');
        });
    });
});

router.get('/current', auth, async (req, res) => {
    try {
        const user = req.user;
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
        const { role } = req.body; // Obtener el rol enviado en el cuerpo de la solicitud

        if (!['admin', 'user', 'premium'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role; // Establecer el nuevo rol
        await user.save();

        res.status(200).json({ message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el rol del usuario' });
    }
});

router.delete('/:uid', auth, isAdmin, async (req, res) => {
    try {
        const userId = req.params.uid;
        const result = await UC.delete(userId);  

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
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
        const tokenDate = decoded.createdAt;
        const currentTime = new Date.now();
        
        const tokenFindOut = (currentTime - tokenDate) / (1000 * 60);
        if (tokenFindOut > 60 ) {
            return res.status(400).send('Token de restablecimiento de password caducado');
        }

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

router.delete('/', async (req, res) => {
    const user = req.user

    try {
        // Calcula la fecha de inactividad
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 2);
        
        const usersToDelete = await user.find({ lastLogin: { $lt: cutoffDate } }).exec();
        
        if (usersToDelete.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios inactivos para eliminar' });
        }

        await Promise.all(usersToDelete.map(user => sendDeletionEmail(user.email)));

        await userModel.deleteMany({ lastLogin: { $lt: cutoffDate } }).exec();

        res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
});


export default usersRouter;