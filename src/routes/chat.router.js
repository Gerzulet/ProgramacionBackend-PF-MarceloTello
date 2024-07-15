import express from "express";

import MessageController from "../controllers/messageController.js";
import { isUser, auth } from '../middlewares/auth.js';

const router = express.Router();
const chatRouter = router;

const MC = new MessageController();

router.get("/messages", async (req, res) => {
    try {
        const messages = await MC.getAll();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/message", auth, isUser, async (req, res) => {
    const { user, message } = req.body;

    if (!user || !message) {
        return res.status(400).json({ error: "El usuario y el mensaje son obligatorios" });
    }

    try {
        const newMessage = await MC.add(user, message);
        
        io.emit("messageLogs", await MC.getAll());

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).send("Error interno del servidor");
    }
});


export default chatRouter;