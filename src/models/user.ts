import { PrismaClient } from "@prisma/client";
//import { User } from "./user.interface";
const prisma = new PrismaClient();

/*
  export const createUser = async (user: User) => {
  const userData = await prisma.user.create({
    data: user,
  });
  return userData;
};

export const getUserById = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return userData;
};

export const getUserByEmail = async (email: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return userData;
};

export const getUserByUsername = async (username: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return userData;
};

export const updateUser = async (id: string, user: User) => {
  const userData = await prisma.user.update({
    where: {
      id: id,
    },
    data: user,
  });
  return userData;
};

export const deleteUser = async (id: string) => {
  const userData = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return userData;
};
*/

export default prisma.user;