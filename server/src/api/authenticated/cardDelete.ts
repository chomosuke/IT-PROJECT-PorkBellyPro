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
    /*
     * need to fetch card and check that card matches id.
     * also need to check that card belongs to user
     */
    const dbs = await this.parent.db.startSession();
    // begin transaction to fetch card and validate ownership
    try {
      await dbs.withTransaction(async () => {
        // removes card in collection belonging to user
        const cardToDelete = await this.parent.Cards.findById(id);
        if (!cardToDelete) {
          throw new HttpStatusError(410);
        } else if (user.id !== cardToDelete.user.toString()) {
          throw new HttpStatusError(401);
        } else {
          await this.parent.Cards.findByIdAndDelete(id);
          res.status(204).send();
        }
      });
    } finally {
      dbs.endSession();
    }
  },
);
