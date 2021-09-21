/* eslint-disable no-underscore-dangle */
import { HttpStatusError } from '../HttpStatusError';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';

export const image: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function image(req, res) {
    const { user, params } = req;
    const { imageHash } = params;

    const cardDoc = await this.parent.Cards.findOne({ user: user._id, imageHash });
    if (cardDoc === null) {
      throw new HttpStatusError(404);
    }

    res.contentType('image/jpeg');
    res.removeHeader('Cache-Control');
    res.end(cardDoc.image);
  },
);
