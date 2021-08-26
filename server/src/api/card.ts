import { ApiRequestHandler } from './api-router';

export const createCard: ApiRequestHandler = function createCard(_req, res) {
  // TODO: accept api
  res.send('cards created');
};

export const updateCard: ApiRequestHandler = function updateCard(_req, res) {
  // TODO: accept api
  res.send('Cards updated');
};

export const deleteCard: ApiRequestHandler = function deleteCard(_req, res) {
  // TODO: read api
  res.send('Card deleted');
};
