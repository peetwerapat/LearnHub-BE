import { Content, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreatContent, IUpdateContent } from ".";

export default class ContentRepository implements IContentRepository {
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(ownerId: string, content: ICreatContent): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        postedBy: {
          connect: { id: ownerId },
        },
      },
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  public getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  // public getById(id: string): Promise<IContent> {
  //   return this.prisma.content.findUniqueOrThrow({});
  // }

  // public partialUpdate(id: string, data: IUpdateContent): Promise<IContent> {
  //   return this.prisma.content.update({
  //     where: { id: id },
  //     data: data,
  //   });
  // }
}
