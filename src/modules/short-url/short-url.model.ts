import Papr, { Model, schema, types } from 'papr';

declare module '#app/container.js' {
  interface AppCradle {
    ShortUrlModel: ShortUrl;
  }
}

const shortUrlSchema = schema(
  {
    url: types.string({
      pattern:
        'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)',
      required: true,
    }),
    shortCode: types.string({
      required: true,
    }),
  },
  {
    timestamps: true,
  },
);

export type ShortUrlDocument = typeof shortUrlSchema[0];
export type ShortUrl = Model<
  typeof shortUrlSchema[0],
  typeof shortUrlSchema[1]
>;

export const registerShortUrlModel = ({ papr }: { papr: Papr }) => {
  const ShortUrl = papr.model('shortUrls', shortUrlSchema);

  return ShortUrl;
};

export default registerShortUrlModel;
