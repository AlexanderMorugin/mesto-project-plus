// 200 - Запрос успешно обработан
export const STATUS_SUCCESS = 200;
// 201 - Ресурс успешно создан
export const STATUS_CREATED = 201;

// Bad Request Error 400 — переданы некорректные данные в методы создания карточки,
// пользователя, обновления аватара пользователя или профиля;
export const STATUS_BAD_REQUEST = 400;
// Unauthorized Error 401 - отказ в доступе
export const STATUS_UNAUTHORIZED = 401;
// Forbidden Error 403 - ограничение или отсутствие доступа к материалу
export const STATUS_FORBIDDEN = 403;
// Not Found Error 404 — карточка, пользователь или страница не найдены.
export const STATUS_NOT_FOUND = 404;
// Conflict Error 409 - пользователь пытается зарегистрироваться по уже существующему в базе email
export const STATUS_CONFLICT = 409;
// Server Error 500 — ошибка по умолчанию.
export const STATUS_SERVER_ERROR = 500;
