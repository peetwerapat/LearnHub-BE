import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }
  create: IContentHandler["create"] = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;

    if (rating > 5 || rating < 0)
      return res
        .status(400)
        .json({ message: "rating is out of range 0-5" })
        .end();

    const {
      User: { registeredAt, id, username, name },
      ...contentData
    } = await this.repo.create(res.locals.user.id, {
      rating,
      videoUrl,
      comment,
      creatorName: "",
      creatorUrl: "",
      thumbnailUrl: "",
      videoTitle: "",
    });

    return res
      .status(201)
      .json({
        ...contentData,
        postedBy: {
          id,
          username,
          name,
          registeredAt: registeredAt.toISOString(),
        },
      })
      .end();
  };
}
