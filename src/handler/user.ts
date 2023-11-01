import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUserRepository } from "../repositories";
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
  };
}
