import { HttpStatusError } from '../HttpStatusError';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';

export const image: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function image(req, res) {
    const { user, params } = req;
    const { cardId } = params;

    const cardDoc = await this.parent.Cards.findById(cardId);
    if (cardDoc === null) {
      throw new HttpStatusError(404);
    }
    const imageData = cardDoc.image;
    if (imageData == null) {
      throw new HttpStatusError(404);
    }
    if (cardDoc.user.toString() !== user.id) {
      throw new HttpStatusError(401);
    }

    res.contentType('image/jpeg');
    res.end(imageData);
  },
);
