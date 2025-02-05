import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export const generateToken = async (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: 3600,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};