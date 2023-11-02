import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JWT_SECRET } from "../utils/const";
import { sign } from "jsonwebtoken";

export default class UserHandler implements IUserHandler {
  constructor(private repo: IUserRepository) {
    this.repo = repo;
  }

  public login: IUserHandler["login"] = async (req, res) => {
    const { username, password: plainPassword } = req.body;
    try {
      const { password, id } = await this.repo.findByUsername(username);

      if (!verifyPassword(plainPassword, password))
        throw new Error("Invalid username or password");

      const accessToken = sign({ id: id }, JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "Learnhub-api",
        subject: "user-credential",
      });

      return res.status(200).json({ accessToken }).end();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid username or password" })
        .end();
    }
  };

  //public registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto> // * Full Syntax
  public registration: IUserHandler["registration"] = async (req, res) => {
    // * Full Syntax
    // const name = req.body.name
    // const username = req.body.username
    // const plainPassword = req.body.password;

    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" });
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" });
    if (typeof plainPassword !== "string" || plainPassword.length < 5)
      return res.status(400).json({ message: "password is invalid" });

    try {
      const {
        id: registerId,
        name: registerName,
        registeredAt,
        username: registerUsername,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });
      return res
        .status(201)
        .json({
          id: registerId,
          name: registerName,
          registeredAt: `${registeredAt}`,
          username: registerUsername,
        })
        .end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(500).json({
          message: `name is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };
}
