import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.services";


export const register = async(req: Request, res: Response): Promise<void> => {
  
    const { username, email, password } = req.body;

    try {

        if (!email){
            res.status(400).json({ error: "Email Required" });
        }

        if (!username){
            res.status(400).json({ error: "Username Required" });
        }

        if (!password){
            res.status(400).json({ error: "Password Required" });
        }
      
        const hashedPassword = await hashPassword(password);

        const user = await prisma.create(
            {
                data:{
                    username,
                    email,
                    password: hashedPassword
                }
            }
        )

        const token = await generateToken(user);
        res.status(201).json({ token });
        
    } catch (error: any) {

        console.log(error);

        if (error?.code === "P2002" && error?.meta?.target?.includes("email")){
            res.status(400).json({ error: "Email Already Exists" });
        }

        if (error?.code === "P2002" && error?.meta?.target?.includes("username")){
            res.status(400).json({ error: "Username Already Exists" });
        }

    }

};

export const login = async(req: Request, res: Response): Promise<void> => {
  
    const { username, email, password } = req.body;

    try {
      
        const user = await prisma.findUnique({
            where: {
                email,
                username
            }
        })
      
        if (!user) {
            res.status(401).json({ error: "User Not Found" });
            return;
        }
      
        const isPasswordCorrect = await comparePassword(password, user.password);
        
        if (!isPasswordCorrect) {
            res.status(401).json({ error: "Incorrect Password" });
            return;
        }
       
        const token = await generateToken(user);
        res.status(200).json({ token });
      
    } catch (error: any) {
      
        //TODO: mejorar el error
        console.log(error);
        res.status(500).json({ error: "Internal Server Error - Login Failed" });
      
    }
  
};