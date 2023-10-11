export const STATUS_SUCCESS = 200;
export const SUCCES_MESSAGE = 'Запрос успешно обработан';

export const STATUS_CREATED = 201;
export const CREATE_SUCCES_MESSAGE = 'Ресурс успешно создан';

// eslint-disable-next-line max-len
// 400 — переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;
export const STATUS_BAD_REQUEST = 400;
export const INVALID_DATA_MESSAGE = 'Переданы некорректные данные';

export const STATUS_UNAUTHORIZED = 401;
export const STATUS_FORBIDDEN = 403;

// 404 — карточка или пользователь не найден.
export const STATUS_NOT_FOUND = 404;
export const USER_NOT_FOUND_MESSAGE = 'Пользователь не найден';
export const CARD_NOT_FOUND_MESSAGE = 'Карточкa не найденa';

export const STATUS_CONFLICT = 409;

// 500 — ошибка по умолчанию.
export const STATUS_SERVER_ERROR = 500;
export const SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';

export const CARD_DELETE_MESSAGE = 'Карточка успешно удалена';
