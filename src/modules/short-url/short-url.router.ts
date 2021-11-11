import { AppCradle } from '#app/container.js';
import { ShortUrlDocument } from '#app/modules/short-url/short-url.model.js';
import * as t from 'io-ts';
import { nanoid } from 'nanoid';
import { Parser, Response, route, Route } from 'typera-express';

type ShortUrlRoute = Route<
  Response.Ok<CreateShortUrlResponseDto> | Response.BadRequest<string>
>;

declare module '#app/container.js' {
  interface AppCradle {
    shortUrlRouter: ShortUrlRoute;
  }
}

const createShortUrlDtoBody = t.type({ url: t.string });

type CreateShortUrlResponseDto = ShortUrlDocument;

export const shortUrlRouter = ({ ShortUrlModel }: AppCradle): ShortUrlRoute =>
  route
    .post('/shorturl')
    .use(Parser.body(createShortUrlDtoBody))
    .handler(async (request) => {
      const shortUrl = await ShortUrlModel.then((model) => {
        return model.insertOne({
          url: request.body.url,
          shortCode: nanoid(7),
        });
      });

      return Response.ok(shortUrl);
    });

export default shortUrlRouter;
