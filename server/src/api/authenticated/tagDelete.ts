/* eslint-disable no-underscore-dangle */

import { ObjectId } from 'mongodb';
import { HttpStatusError } from '../HttpStatusError';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';

export const tagDelete: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function tagDelete(req, res) {
    const { user, body: { id } } = req;

    if (typeof id !== 'string') {
      throw new HttpStatusError(400);
    }

    let tagId: ObjectId;
    try {
      tagId = new ObjectId(id);
    } catch {
      throw new HttpStatusError(400);
    }

    const session = await this.parent.db.startSession();
    try {
      await session.withTransaction(
        async () => {
          const tag = await this.parent.Tags.findOneAndDelete({
            _id: tagId,
            user: user._id,
          });
          if (tag == null) throw new HttpStatusError(410);

          await this.parent.Cards.updateMany(
            {
              user: user._id,
            },
            {
              $pull: {
                tags: tagId,
              },
            },
          );

          res.sendStatus(200);
        },
      );
    } finally {
      session.endSession();
    }
  },
);
