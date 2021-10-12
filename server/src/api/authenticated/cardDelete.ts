/* eslint-disable no-underscore-dangle */
import { Types } from 'mongoose';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from '../HttpStatusError';

export const cardDelete: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function cardDelete(req, res) {
    const { user, body } = req;
    // check that the body contains an id.
    const { id } = body;

    if (typeof id !== 'string') {
      throw new HttpStatusError(400);
    }

    let cardId : undefined | Types.ObjectId;

    try {
      cardId = Types.ObjectId(id);
    } catch (e) {
      throw new HttpStatusError(400);
    }

    /*
     * need to fetch card and check that card matches id.
     * also need to check that card belongs to user
     */
    const dbs = await this.parent.db.startSession();
    // begin transaction to fetch card and validate ownership
    try {
      await dbs.withTransaction(async () => {
        // removes card in collection belonging to user
        const cardToDelete = await this.parent.Cards.findById(cardId);
        if (!cardToDelete) {
          throw new HttpStatusError(410);
        } else if (!user._id.equals(cardToDelete.user)) {
          throw new HttpStatusError(410);
        } else {
          await cardToDelete.remove();
          res.sendStatus(204);
        }
      });
    } finally {
      dbs.endSession();
    }
  },
);
