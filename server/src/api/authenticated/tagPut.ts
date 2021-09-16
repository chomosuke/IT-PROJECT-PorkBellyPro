import { get } from 'color-string';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from '../HttpStatusError';

function isValidColor(color: string): boolean {
  return get(color) != null;
}

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
