import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

// * ExSyntax Choice 2 for IUser
// export interface IUserExtended
//   extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;

  findByUsername(username: string): Promise<User>;

  findById(id: string): Promise<IUser>;
}

export interface ICreatContent
  extends Omit<Content, "ownerId" | "id" | "createdAt" | "updateAt"> {}

export interface IContent extends Content {
  User: IUser;
}

export interface IContentRepository {
  create(ownerId: string, content: ICreatContent): Promise<IContent>;
}
