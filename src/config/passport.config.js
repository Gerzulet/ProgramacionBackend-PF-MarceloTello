import passport from "passport";
import local from "passport-local"
import GitHubStrategy from 'passport-github2';
import userModel from "../dao/mongo/models/userModel.js";
import { createHash, isValidPassword } from "../utils/functionsUtils.js";


const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {passReqToCallback:true,usernameField:'email'},async (req,username,password,done)=>{
            const {first_name,last_name,email,age} = req.body;

            try {
                let user = await userModel.findOne({email:username});
                if (user) {
                    console.log("Usuario ya existente");
                    return done(null,false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }
                let result = await userModel.create(newUser);
                return done(null,result);
            }catch(e) {
                return done("Error al obtener el usuario:"+e);
            }
        }
    ));
    passport.use('login', new localStrategy(
        {passReqToCallback:true,usernameField:'email'},
         async (req,email,password, done) =>{
            try {
                const userResult = await userModel.findOne({email: req.body.email});
                if (!userResult) {
                    console.log("No existe el usuario");
                    return done(null,false);
                }
        
                if (!isValidPassword(userResult, req.body.password)) {
                    console.log("Contraseña no valida");
                    return done(null,false);
                }
        
                delete userResult.password;
                req.session.user = userResult;
        
                return done(null,userResult)
            } catch (e) {
                return done("Error al iniciar sesion:"+e);
            }
        }
    ));

    const CLIENT_ID = "Iv23ctAiZVTI2pNeSE29";
    const SECRET_ID = 'e6fc99987c3cd944e6e5c30f63407a7b6a884c18';

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let email = profile._json.email || `${profile._json.login}@github.com`;
    
            // Buscar usuario por email
            let user = await userModel.findOne({ email });
    
            if (user) {
                return done(null, user);
            } else {
                let newUser = {
                    first_name: profile._json.name || profile._json.login,
                    last_name: '',
                    age: 18,
                    email: email,
                    password: ''
                };
                let result = await userModel.create(newUser);
                return done(null, result);
            }
        } catch (e) {
            console.error('Error in GitHub Strategy:', e);
            return done(e);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null,user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null,user);
    });
}

export default initializePassport;