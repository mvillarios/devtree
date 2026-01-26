import { Request, Response } from "express";
import slug from "slug";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const creatAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("Un usuario con ese mail ya está registrado");
    return res.status(409).json({ error: error.message });
  }

  const handle = slug(req.body.handle, "");
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    const error = new Error("Nombre de Usuario No Disponible");
    return res.status(409).json({ error: error.message });
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();

  res.status(201).send("Usuario registrado exitosamente");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //Revisar Usuario Registrado
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ error: error.message });
  }

  //Comprobar Contraseña
  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Contraseña Incorrecta");
    return res.status(401).json({ error: error.message });
  }

  res.status(200).send("Inicio de sesión exitoso");
};
