import { IContentDto } from "../dto/content";
import { IContent } from "../repositories";

export default (content: IContent): IContentDto => {
  const {
    postedBy: { registeredAt, id, username, name },
    ...contentData
  } = content;

  return {
    ...contentData,
    postedBy: {
      id,
      username,
      name,
      registeredAt,
    },
  };
};
