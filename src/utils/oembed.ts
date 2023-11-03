import axios, { AxiosError } from "axios";
import { OEmBedDto } from "../dto/oembed";

export const getOEmbedInfo = async (videoUrl: string): Promise<OEmBedDto> => {
  const res = await axios.get<OEmBedDto>(
    `https://noembed.com/embed?url=${videoUrl}`
  );

  const { author_name, url, thumbnail_url, title, error } = res.data;
  if (error) throw new URIError("Invalid video link");

  return { author_name, url, thumbnail_url, title, error };
};
