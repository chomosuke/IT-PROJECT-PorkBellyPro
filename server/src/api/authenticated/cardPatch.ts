import {
  CardPatchResponse,
} from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from '../HttpStatusError';

export const dataURIPrefix = 'data:image/jpeg;base64,';

// sanitation and image validation adapted from cardPut.ts
export const cardPatch: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function cardPatch(req, res) {
    // user has been validated by middleware
    const { user, body } = req;

    // extract present card information
    const {
      id,
      favorite,
      name,
      phone,
      email,
      jobTitle,
      company,
      tags,
    } = body;
    // will transform
    let { fields, image } = body;

    /*
     * check for types. details left as undefined if it is not found
     * in the body
     */
    if (typeof id !== 'string'
            || (favorite !== undefined && typeof favorite !== 'string')
            || (name !== undefined && typeof name !== 'string')
            || (phone !== undefined && typeof phone !== 'string')
            || (email !== undefined && typeof email !== 'string')
            || (jobTitle !== undefined && typeof jobTitle !== 'string')
            || (company !== undefined && typeof company !== 'string')
            || (image !== undefined && typeof image !== 'string')
            || (!Array.isArray(fields))
            || (!Array.isArray(tags))) {
      // bad request
      throw new HttpStatusError(400);
    }

    // transform fields and tags (if any)
    fields = fields?.map((f) => {
      const { key, value } = f;
      if (typeof key !== 'string'
                || typeof value !== 'string') {
        throw new HttpStatusError(400);
      }
      return { key, value };
    });

    tags?.forEach((t) => {
      if (typeof t !== 'string') {
        throw new HttpStatusError(400);
      }
    });

    // image validation
    if (image !== undefined) {
      // sanatize image
      if (typeof image !== 'string'
                || image.substr(0, dataURIPrefix.length) !== dataURIPrefix) {
        throw new HttpStatusError(400);
      }
      try {
        image = await Jimp.read(Buffer.from(image.substr(dataURIPrefix.length), 'base64'));
      } catch (e) {
        throw new HttpStatusError(400);
      }
      image = await image.getBufferAsync(Jimp.MIME_JPEG);
      // check for buffer size -- set limit to 1MB may hoist to env variable
      if (image.length >= 2 ** 20) {
        throw new HttpStatusError(400);
      }
    }

    const dbs = await this.parent.db.startSession();
    try {
      await dbs.withTransaction(async () => {
        /*
         * inside transaction.
         * validating that the tags are in db
         */
        await Promise.all(
          // maps tags into array of promises
          tags.map(async (tagId: string) => {
            const tag = await this.parent.Tags.findById(tagId);
            if (tag == null) {
              throw new HttpStatusError(400);
            } else if (tag.user.toString() !== user.id) {
              throw new HttpStatusError(401);
            }
          }),
        );
        /*
         * tags are fine
         * fetch update clause
         * for undefined things, they will be interpreted as removing
         * such details from cards
         */
        const updatedCard = await this.parent.Cards.findByIdAndUpdate(id,
          {
            $set: {
              id,
              favorite,
              name,
              phone,
              email,
              jobTitle,
              company,
              tags,
              fields,
              image,
            },
          },
          // ensures updated card is returned
          { new: true });
        // if card is not found
        if (!updatedCard) {
          throw new HttpStatusError(404);
        }

        const response: CardPatchResponse = {
          id: updatedCard.id,
          favorite: updatedCard.favorite,
          name: updatedCard.name,
          phone: updatedCard.phone,
          email: updatedCard.email,
          jobTitle: updatedCard.jobTitle,
          company: updatedCard.company,
          hasImage: !!updatedCard.image,
          fields: updatedCard.fields.map((f) => ({ key: f.key, value: f.value })),
          tags: updatedCard.tags.map((t) => t.toString()),
        };
        res.status(200).json(response);
      });
    } finally {
      dbs.endSession();
    }
  },
);
