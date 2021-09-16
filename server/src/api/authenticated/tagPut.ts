/* eslint-disable no-underscore-dangle */

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
      user: user._id,
      label,
      color,
    });

    await tag.save();

    res.status(201).json({
      id: tag._id,
      label: tag.label,
      color: tag.color,
    });
  },
);
