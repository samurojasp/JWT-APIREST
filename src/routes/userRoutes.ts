import e from "express";
import express, { NextFunction, Request, Response } from "express";
import { get } from "http";
import jwt from "jsonwebtoken";
import { getUsers, createUser, deleteUser, getUserById, updateUser } from "../controllers/usersControllers";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

//Middleware de JWT
const authToken = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ error: "TOKEN NOT AUTHORIZED" });
            return;
        }

        jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
            if (err) {
                res.status(403).json({ error: "Do not have access" });
                return;
            }
            
            next();
        });
    };
};

router.get("/", authToken(), getUsers)

router.get("/:id", authToken(), getUserById)

router.post("/", authToken(), createUser) 

router.put("/:id", authToken(), updateUser)

router.delete("/:id", authToken(), deleteUser) 


export default router;