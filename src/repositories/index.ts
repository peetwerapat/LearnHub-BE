import { Content, User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IContentDto, IUpdateContentDto } from "../dto/content";

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

export interface IContent extends Omit<Content, "ownerId"> {
  postedBy: IUser;
}

export interface IUpdateContent {
  comment?: string;
  rating?: number;
}

export interface IContentRepository {
  getAll(): Promise<IContent[]>;
  create(ownerId: string, content: ICreatContent): Promise<IContent>;
  getById(id: number): Promise<IContent>;
  partialUpdate(id: number, data: IUpdateContent): Promise<IContent>;
  delete(id: number): Promise<IContent>;
}

export interface IBlacklistRepository {
  addToBlacklist(token: string, exp: number): Promise<void>;
  isAlreadyBlacklisted(token: string): Promise<boolean>;
}
