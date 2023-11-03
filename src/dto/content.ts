import { Content } from "@prisma/client";
import { IUserDto } from "./user";

export interface IContentDto {
  id: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  postedBy: IUserDto;
  createdAt: Date;
  updateAt: Date;
}

export interface ICreateContentDto
  extends Pick<IContentDto, "videoUrl" | "comment" | "rating"> {}

export interface IUpdateContentDto
  extends Pick<IContentDto, "comment" | "rating"> {}
