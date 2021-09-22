/* eslint-disable no-underscore-dangle */

import { ObjectId } from 'mongodb';
import { isValidColor } from '../../isValidColor';
import { HttpStatusError } from '../HttpStatusError';
import { AuthenticatedApiRequestHandlerAsync, asyncRouteHandler } from './asyncRouteHandler';

export const tagPatch: AuthenticatedApiRequestHandlerAsync = asyncRouteHandler(
  async function tagPatch(req, res) {
    const { user, body } = req;
    const { id, label, color } = body;

    if (
      typeof id !== 'string'
      || (label !== undefined && typeof label !== 'string')
      || (color !== undefined && (typeof color !== 'string' || !isValidColor(color)))) {
      throw new HttpStatusError(400);
    }

    let tagId: ObjectId;
    try {
      tagId = new ObjectId(id);
    } catch {
      throw new HttpStatusError(400);
    }

    const update: { label?: string; color?: string } = {};
    if (label != null) update.label = label;
    if (color != null) update.color = color;

    const tag = await this.parent.Tags.findOneAndUpdate(
      {
        _id: tagId,
        user: user._id,
      },
      update,
      {
        new: true,
        useFindAndModify: false,
      },
    );

    if (tag == null) throw new HttpStatusError(410);

    res.status(200).json({
      id: tag._id,
      label: tag.label,
      color: tag.color,
    });
  },
);
