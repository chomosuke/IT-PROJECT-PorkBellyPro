/* eslint-disable no-underscore-dangle */
import {
  CardPatchResponse,
} from '@porkbellypro/crm-shared';
import Jimp from 'jimp';
import { Types } from 'mongoose';
import { createHash } from 'crypto';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from '../HttpStatusError';
import { ICardField } from '../../models/card';

export const dataURIPrefix = 'data:image/jpeg;base64,';

// sanitation and image validation adapted from cardPut.ts
export const cardPatch: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function cardPatch(req, res) {
    // user has been validated by middleware
    const { user, body } = req;

    // extract query information
    const {
      id,
      favorite,
      name,
      phone,
      email,
      jobTitle,
      company,
      tags,
      image,
    } = body;
    // will transform
    let { fields } = body;

    /*
     * check for types. details left as undefined if it is not found
     * in the body
     */
    if (typeof id !== 'string'
      || (favorite !== undefined && typeof favorite !== 'boolean')
      || (name !== undefined && typeof name !== 'string')
      || (phone !== undefined && typeof phone !== 'string')
      || (email !== undefined && typeof email !== 'string')
      || (jobTitle !== undefined && typeof jobTitle !== 'string')
      || (company !== undefined && typeof company !== 'string')
      || (fields !== undefined && !Array.isArray(fields))
      || (tags !== undefined && !Array.isArray(tags))) {
      // bad request
      throw new HttpStatusError(400);
    }

    // transform fields and tags (if any)
    fields = fields?.map((f: ICardField) => {
      const { key, value } = f;
      if (typeof key !== 'string'
        || typeof value !== 'string') {
        throw new HttpStatusError(400);
      }
      return { key, value };
    });

    let cardId : undefined | Types.ObjectId;

    try {
      cardId = Types.ObjectId(id);
    } catch (e) {
      throw new HttpStatusError(400);
    }

    tags?.map((t: string) => {
      if (typeof t !== 'string') {
        throw new HttpStatusError(400);
      }
      try {
        return Types.ObjectId(t);
      } catch (e) {
        throw new HttpStatusError(400);
      }
    });

    // image validation
    let imageBuffer: Buffer | undefined | null;
    let imageHash: string | undefined | null;
    if (image !== undefined) {
      if (image === null) {
        // null image means remove the image from card
        imageBuffer = null;
        imageHash = null;
      } else if (typeof image !== 'string'
        || image.substr(0, dataURIPrefix.length) !== dataURIPrefix
        || image === '') {
        throw new HttpStatusError(400);
      } else {
        let jimpImage;
        try {
          jimpImage = await Jimp.read(Buffer.from(image.substr(dataURIPrefix.length), 'base64'));
        } catch (e) {
          throw new HttpStatusError(400);
        }
        imageBuffer = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);

        // now hash
        imageHash = createHash('sha256').update(imageBuffer).digest('hex');
      }
    }
    /*
     * removed undefined fields :: undefined fields are fields that
     * do not require an update.
     * Programmer's note: Leaving a "" in fields will overwrite the fields
     */
    const updateDetails = Object.fromEntries(
      Object.entries({
        favorite,
        name,
        phone,
        email,
        jobTitle,
        company,
        image: imageBuffer,
        imageHash,
        tags,
        fields,
      }).filter(([, val]) => val !== undefined),
    );

    const dbs = await this.parent.db.startSession();
    try {
      await dbs.withTransaction(async () => {
        /*
         * inside transaction.
         * validating that the tags are in db
         */
        if (tags) {
          await Promise.all(
            // maps tags into array of promises
            tags.map(async (tagId: Types.ObjectId) => {
              const tag = await this.parent.Tags.findById(tagId);
              if (tag == null) {
                throw new HttpStatusError(400);
              } else if (!user._id.equals(tag.user)) {
                throw new HttpStatusError(401);
              }
            }),
          );
        }
        /*
         * tags are fine
         * fetch update clause
         * for undefined things, they will be interpreted as not needing to update
         * such details from cards
         */
        const updatedCard = await this.parent.Cards.findById(cardId);
        // if card is not found
        if (!updatedCard) {
          throw new HttpStatusError(404);
        } else if (!user._id.equals(updatedCard.user)) {
          throw new HttpStatusError(401);
        } else {
          updatedCard.set(updateDetails);
          await updatedCard.save();
        }

        const response: CardPatchResponse = {
          id: updatedCard.id,
          favorite: updatedCard.favorite,
          name: updatedCard.name,
          phone: updatedCard.phone,
          email: updatedCard.email,
          jobTitle: updatedCard.jobTitle,
          company: updatedCard.company,
          imageHash: imageHash || undefined,
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
