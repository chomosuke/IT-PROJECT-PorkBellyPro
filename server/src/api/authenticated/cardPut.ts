import {
  CardPutResponse,
} from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from '../HttpStatusError';

export const dataURIPrefix = 'data:image/jpeg;base64,';

export const cardPut: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function cardPut(req, res) {
    const { user, body } = req;

    // sanatization
    const {
      name,
      phone,
      email,
      jobTitle,
      company,
      tags,
      image,
    } = body;
    let { fields } = body;

    if (typeof name !== 'string'
    || typeof phone !== 'string'
    || typeof email !== 'string'
    || typeof jobTitle !== 'string'
    || typeof company !== 'string'
    || !Array.isArray(fields)
    || !Array.isArray(tags)) {
      throw new HttpStatusError(400);
    }

    fields = fields.map((f) => {
      const { key, value } = f;
      if (typeof key !== 'string'
      || typeof value !== 'string') {
        throw new HttpStatusError(400);
      }
      return { key, value };
    });

    tags.forEach((t) => {
      if (typeof t !== 'string') {
        throw new HttpStatusError(400);
      }
    });

    let imageBuffer: Buffer | undefined;
    if (image !== undefined) {
      // sanatize image
      if (typeof image !== 'string'
      || image.substr(0, dataURIPrefix.length) !== dataURIPrefix) {
        throw new HttpStatusError(400);
      }
      let jimpImage;
      try {
        jimpImage = await Jimp.read(Buffer.from(image.substr(dataURIPrefix.length), 'base64'));
      } catch (e) {
        throw new HttpStatusError(400);
      }
      imageBuffer = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
    }

    // now do the actual thing.
    const dbs = await this.parent.db.startSession();
    try {
      await dbs.withTransaction(async () => {
        // last bit of checking that require access to the database
        await Promise.all(
          // using map as forEach does not return promises
          tags.map(async (id: string) => {
            const tag = await this.parent.Tags.findById(id);
            if (tag == null) {
              throw new HttpStatusError(400);
            } else if (tag.user.toString() !== user.id) {
              throw new HttpStatusError(401);
            }
          }),
        );

        const cardDoc = await this.parent.Cards.create({
          user: user.id,
          name,
          phone,
          email,
          jobTitle,
          company,
          fields,
          tags,
          image: imageBuffer,
        });

        const response: CardPutResponse = {
          id: cardDoc.id,
          favorite: cardDoc.favorite,
          name: cardDoc.name,
          phone: cardDoc.phone,
          email: cardDoc.email,
          jobTitle: cardDoc.jobTitle,
          company: cardDoc.company,
          hasImage: cardDoc.image != null,
          fields: cardDoc.fields.map((f) => ({ key: f.key, value: f.value })),
          tags: cardDoc.tags.map((t) => t.toString()),
        };

        res.status(201).json(response);
      });
    } finally {
      dbs.endSession();
    }
  },
);
