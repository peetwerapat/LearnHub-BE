import { RequestHandler } from "express";
import { JWT_SECRET } from "../utils/const";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { IBlacklistRepository } from "../repositories";

export interface AuthStatus {
  user: { id: string };
}
export default class JWTMiddleware {
  constructor(private blacklistRepo: IBlacklistRepository) {}

  auth: RequestHandler<unknown, unknown, unknown, unknown, AuthStatus> = async (
    req,
    res,
    next
  ) => {
    try {
      const token = req.header("Authorization")!.replace("Bearer ", "").trim();
      const isBlacklisted = await this.blacklistRepo.isAlreadyBlacklisted(
        token
      );
      if (isBlacklisted)
        throw new JsonWebTokenError(`Token: ${token} is blacklisted`);

      const { id } = verify(token, JWT_SECRET) as JwtPayload;

      console.log(`Found user id in JWT token: ${id}`);

      res.locals = {
        user: {
          id,
        },
      };

      return next();
    } catch (error) {
      if (error instanceof TypeError)
        return res.status(401).send("Authorization header is expected").end();
      if (error instanceof JsonWebTokenError)
        return res.status(403).send("Forbidden: Token is invalid").end();

      return res.status(500).send("Internal Server Error").end();
    }
  };
}
