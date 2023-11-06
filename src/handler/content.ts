import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";
import { getOEmbedInfo } from "../utils/oembed";
import mapToDto from "../utils/content.mapper";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  public getAll: IContentHandler["getAll"] = async (req, res) => {
    const result = await this.repo.getAll();

    return res.status(200).json(result).end();
  };

  // public getById: IContentHandler["getById"] = async (req, res) => {
  //   const { id } = req.params;

  //   const numbericId = Number(id);
  // };

  create: IContentHandler["create"] = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;

    if (rating > 5 || rating < 0)
      return res
        .status(400)
        .json({ message: "rating is out of range 0-5" })
        .end();

    try {
      const { author_name, url, thumbnail_url, title } = await getOEmbedInfo(
        videoUrl
      );

      const data = await this.repo.create(res.locals.user.id, {
        rating,
        videoUrl,
        comment,
        creatorName: author_name,
        creatorUrl: url,
        thumbnailUrl: thumbnail_url,
        videoTitle: title,
      });

      return res.status(201).json(mapToDto(data)).end();
    } catch (error) {
      console.error(error);
      if (error instanceof URIError)
        return res.status(400).json({ message: error.message }).end();

      return res.status(500).json({ message: "Internal Server Error" }).end();
    }
  };
}
