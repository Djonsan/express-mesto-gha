const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const deleteCardById = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((cards) => {
    if (!cards) {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    } return res.send({ data: cards });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((cards) => {
    if (!cards) {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    } return res.send({ data: cards });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((cards) => {
    if (!cards) {
      return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    } return res.send({ data: cards });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
