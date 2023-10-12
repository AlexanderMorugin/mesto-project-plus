import { celebrate, Joi } from 'celebrate';
import { EMAIL_REG_EXP, ID_REG_EXP, URL_REG_EXP } from '../utils/validate';

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(new RegExp(URL_REG_EXP)),
    email: Joi.string().required().pattern(new RegExp(EMAIL_REG_EXP)),
    password: Joi.string().required().min(6),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(URL_REG_EXP)),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(new RegExp(EMAIL_REG_EXP)),
    password: Joi.string().required().min(6),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(URL_REG_EXP)),
  }),
});

const validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(new RegExp(ID_REG_EXP)),
  }),
});



export default {
  validateGetUserById,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateAvatar,
  validateLoginUser,

  validateCreateCard,
  validateCardById,
};
