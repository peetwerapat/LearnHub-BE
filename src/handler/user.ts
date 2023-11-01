import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUserRepository, UserCreationError } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  constructor(private repo: IUserRepository) {
    this.repo = repo;
  }

  //registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto> // * Full Syntax
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
      if (error instanceof UserCreationError) {
        return res.status(500).json({
          message: `${error.column} is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };
}
