import { type NextApiRequest, type NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = (await req.body) as {
      name: string;
      username: string;
      password: string;
    };

    // Check if user exists
    const userExists = await prisma?.user?.findFirst({
      where: {
        name: username,
      },
    });
    if (userExists) {
      res.status(422).json({
        success: false,
        message: "A user with the same email already exists!",
        userExists: true,
      });
      return;
    }

    // Hash Password
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: username,
        hashedPassword: hashed_password,
      },
    });

    if (!user.hashedPassword) return;

    res.status(201).json({
      ...user
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid method" });
  }
}
