import axios, { AxiosError } from "axios";
import { OEmBedDto, OEmbedError } from "../dto/oembed";

const isError = (data: OEmBedDto | OEmbedError): data is OEmbedError =>
  Object.keys(data).includes("error");

export const getOEmbedInfo = async (videoUrl: string): Promise<OEmBedDto> => {
  const res = await axios.get<OEmBedDto>(
    `https://noembed.com/embed?url=${videoUrl}`
  );

  const oembedData = res.data;
  if (isError(oembedData)) throw new URIError("Invalid video link");

  const { author_name, url, thumbnail_url, title } = oembedData;

  return { author_name, url, thumbnail_url, title };
};
