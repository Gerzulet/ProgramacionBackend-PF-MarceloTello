import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import jwt from "jsonwebtoken";

const PRIVATE_KEY = "CoderKeySecretShhh"

const generateToken = (user) => {
    const token = jwt.sign(
        { user },
        PRIVATE_KEY,
        { expiresIn: "1h" }
    );

    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({
            error: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1]; //Remove string "Bearer"
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
            return res.status(403).send(
                {
                    error: "Not authenticated"
                }
            )
        }

        req.user = credentials.user;
        next();
    });
}

export {
    generateToken,
    authToken
}

export default __dirname;