import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export type IUserData = {
  username: string;
  role: UserRole;
};
//getUser

export const getAll = async (offset: number, pageSize: number) => {
  console.log("repo bhitra chiryo");
  return await prisma.user.findMany({
    skip: offset,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllWithSearch = async (
  offset: number,
  pageSize: number,
  searchVal: string
) => {
  console.log("getAllwithSearch ko repo ma aayo");
  return await prisma.user.findMany({
    skip: offset,
    take: pageSize,
    where: {
      username: {
        contains: searchVal,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// post | mutation
export const createUser = async (userData: IUserData) => {
  const role = await prisma.roles.findFirst({
    where: { roleName: userData.role },
  });

  if (!role) {
    console.error(`Error: Role not found for ${userData.role}`);
    throw new Error(`Role not found for ${userData.role}`);
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        role: { connect: { id: role.id } },
      },
    });

    console.log(`User created successfully: ${createdUser.username}`);
    return createdUser;
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    throw new Error(`Error creating user: ${error}`);
  }
};

export const userRepo = {
  getAll,
  getAllWithSearch,
  createUser,
};
