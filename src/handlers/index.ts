import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const creatAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).send("El usuario ya existe");
  }

  const handle = slug(req.body.handle, "");
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    return res.status(409).send("Nombre de Usuario No Disponible");
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();

  res.status(201).send("Usuario registrado exitosamente");
};

export const login = async (req: Request, res: Response) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  //Revisar Usuario Registrado
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("El Usuario no existe");
  }

  //Comprobar Contraseña
  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send("Contraseña Incorrecta");
  }
};
