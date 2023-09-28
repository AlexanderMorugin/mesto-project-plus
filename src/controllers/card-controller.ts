// import { Request, Response } from 'express';
// import Card from '../models/card';

// export const createCard = (req: Request, res: Response) => {
//   const { name, link, owner, likes, createdAt } = req.body;

//   return Card.create({ name, link, owner, likes, createdAt })
//     .then(card => res.send({ data: card }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// };
