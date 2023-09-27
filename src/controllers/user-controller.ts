import { Request, Response } from 'express';
import User from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  User
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ error: "Что то пошло не так..." });
    });
}

export const getUserById = (req: Request, res: Response) => {
  User
    .findById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({ error: "Что то пошло не так..." });
    });
}

export const deleteUserById = (req: Request, res: Response) => {
  User
  .findByIdAndDelete(req.params.id)
  .then((result: any) => {
    res.status(200).json(result);
  })
  .catch(() => {
    res.status(500).json({ error: "Что то пошло не так..." });
  });
}

export const createUser = (req: Request, res: Response) => {
  const postUser = new User(req.body);

  postUser
    .save()
    .then((result: any) => {
      res
        .status(201)
        .json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Что то пошло не так..." });
    });
}

export const updateUser = (req: Request, res: Response) => {
  User
  .findByIdAndUpdate(req.params.id, req.body)
  .then((result: any) => {
    res.status(200).json(result);
  })
  .catch(() => {
    res.status(500).json({ error: "Что то пошло не так..." });
  });
}


// export const getUsers = (req: Request, res: Response) => {
//   const { name, about, avatar } = req.body;

//   return User.create({ name, about, avatar })
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// export const getUsers = (req: Request, res: Response) =>  {
//   return User.find({})
//     .then(users => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// export const createUser = (req: Request, res: Response) => {
//   const { name, about, avatar } = req.body;

//   return User.create({ name, about, avatar })
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// };
