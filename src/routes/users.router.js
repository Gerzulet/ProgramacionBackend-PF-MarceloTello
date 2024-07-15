import {Router} from 'express';
import passport from 'passport';

import UserDTO from '../dao/DTOs/user.dto.js';
import { auth } from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';

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

export default usersRouter;