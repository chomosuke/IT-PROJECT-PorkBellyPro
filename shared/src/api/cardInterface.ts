/*
 * test interface to allow user information to be passed
 * ADAPTED FROM docs/api/card.md prior to PR
 */

export interface CardField {
    key: string;
    value: string;
}

export type ObjectId = string;

export interface Card {
    id: ObjectId;
    favorite: boolean;
    name: string;
    phone: string;
    email: string;
    jobTitle: string;
    company: string;
    fields: CardField[];
    tags: ObjectId[];
}

/*
 * set to string because constructing
 * mongoose.Types.ObjectId(<id>) is not of this type.
 */
export interface CardDeleteRequest {
    id: ObjectId;
}

export type CardPutRequest = Omit<Card, 'id' | 'favorite'>;

export type CardPutResponse = Card;

export type CardPatchResponse = Card;

export type CardPatchRequest = Pick<Card, 'id'> & Partial<Omit<Card, 'id'>>;