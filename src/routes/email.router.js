// src/routes/passwordReset.router.js
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import userModel from '../dao/mongo/models/userModel.js';
import { sendResetEmail } from '../services/emailService.js'; 

const router = express.Router();
const passwordResetRouter = router;

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    await sendResetEmail(email);
    res.status(200).send('Email enviado con exito');
  } catch (error) {
    res.status(500).send('Error al enviar el mail',error);
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const user = await userModel.findOne({
      resetPasswordToken: crypto.createHash('sha256').update(req.params.token).digest('hex'),
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('El token de restablecimiento de contraseña no es válido o ha caducado.');
    }

    if (await bcrypt.compare(password, user.password)) {
      return res.status(400).send('La nueva contraseña no puede ser la misma que la antigua.');
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send('La contraseña ha sido restablecida');
  } catch (error) {
    res.status(500).send('Error al recuperar la contraseña',error);
  }
});

export default passwordResetRouter;