import { Router } from "express";
import { getShorten, postShorten, deleteUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten',validateTokenMiddleware, validateSchemaMiddleware(urlSchema), postShorten);
urlRouter.get('/urls/:shortUrl', getShorten);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl)

export default urlRouter;