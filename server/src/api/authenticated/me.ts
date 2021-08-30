import { Card, MeResponse, Tag } from '@porkbellypro/crm-shared';
import { asyncRouteHandler } from './asyncRouteHandler';

export const me = asyncRouteHandler(async function me(req, res) {
  const { id, username } = req.user;

  let cards: Card[] | null = null;
  let tags: Tag[] | null = null;

  const dbs = await this.parent.db.startSession();
  try {
    await dbs.withTransaction(async () => {
      const cardDocs = await this.parent.Cards.find({ user: id });
      const tagDocs = await this.parent.Tags.find({ user: id });
      cards = cardDocs.map((v) => ({
        id: v.id,
        favorite: v.favorite,
        name: v.name,
        phone: v.phone,
        email: v.email,
        jobTitle: v.jobTitle,
        company: v.company,
        hasImage: Boolean(v.image),
        fields: v.fields,
        tags: v.tags.map((i) => i.toString()),
      }));
      tags = tagDocs.map((v) => ({
        id: v.id,
        label: v.label,
        color: v.color,
      }));
    });
  } finally {
    dbs.endSession();
  }

  if (cards == null || tags == null) throw new Error();

  const response: MeResponse = {
    username,
    settings: {},
    cards,
    tags,
  };

  res.status(200).json(response);
});
