import { isValidColor } from '../../isValidColor';
import { HttpStatusError } from '../HttpStatusError';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';

export const tagPut: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function tagPut(req, res) {
    const { user, body } = req;
    const { label, color } = body;

    if (typeof label !== 'string'
      || typeof color !== 'string'
      || !isValidColor(color)) {
      throw new HttpStatusError(400);
    }

    const tag = new this.parent.Tags({
      user,
      label,
      color,
    });

    await tag.save();

    res.sendStatus(201);
  },
);
