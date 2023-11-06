import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handler";
import UserHandler from "./handler/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handler/content";

const PORT = Number(process.env.PORT || 8080);
const app = express();
const client = new PrismaClient();

const userRepo: IUserRepository = new UserRepository(client);
const userHandler: IUserHandler = new UserHandler(userRepo);

const contentRepo: IContentRepository = new ContentRepository(client);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());

app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.post("/login", userHandler.login);

authRouter.post("/me", jwtMiddleware.auth, userHandler.gerPersonalInfo);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);

contentRouter.get("/", contentHandler.getAll);

contentRouter.get("/:id", contentHandler.getById);

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT}`);
});
