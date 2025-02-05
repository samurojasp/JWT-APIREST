import { Request, Response } from "express";
import { hashPassword} from "../services/password.service";
import prisma from "../models/user";


export const createUser = async(req: Request, res: Response): Promise<void> => {
  
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

        res.status(201).json({user});
        
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

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }
        res.status(200).json(user)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error - Get Failed' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { username, email, password } = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

        if (email) {
            dataToUpdate.email = email
        }

        if (username) {
            dataToUpdate.username = username
        }

        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('User not found')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error - Update Failed' })
        }

        if (error?.code == 'P2025' && error?.meta?.target?.includes('username')) {
            res.status(400).json({ error: 'Username already exists' })
        }
    }
}

export const deleteUser = async(req: Request, res: Response): Promise<void> => {
  
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `User ${userId} deleted successfully`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('User not found')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error - Delete Failed' })
        }
    }
  
};

export const getUsers = async(req: Request, res: Response): Promise<void> => {

    try {
      
        const users = await prisma.findMany()
      
        if (!users) {
            res.status(401).json({ error: "Users Not Found" });
            return;
        }

        res.status(200).json({ users });

      
    } catch (error: any) {
      
        console.log(error);
        res.status(500).json({ error: "Internal Server Error - Get Failed" });
      
    }
  
};