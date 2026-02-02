import { Router } from "express";
import { body } from "express-validator";
import {
  creatAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
} from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

// Autentificacion y Registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle está vacio"),
  body("name").notEmpty().withMessage("El nombre está vacio"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es muy corta"),
  handleInputErrors,
  creatAccount,
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  login,
);

router.get("/user", authenticate, getUser);
router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle está vacio"),
  handleInputErrors,
  authenticate,
  updateProfile,
);

router.post("/user/image", authenticate, uploadImage);

router.get("/:handle", getUserByHandle);

router.post(
  "/search",
  body("handle").notEmpty().withMessage("El handle está vacio"),
  handleInputErrors,
  searchByHandle,
);

export default router;
