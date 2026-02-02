import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { RegisterForm } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { userRegister } from "../api/DevTreeApi";

export default function RegisterView() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultValues: RegisterForm = {
    name: "",
    email: "",
    handle: location?.state?.handle || "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const password = useWatch({ control, name: "password" });

  const userRegisterMutation = useMutation({
    mutationFn: userRegister,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/login");
    },
  });

  const handleUserRegisterForm = (formData: RegisterForm) => {
    userRegisterMutation.mutate(formData);
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-white">Crear Cuenta</h1>
      <form
        onSubmit={handleSubmit(handleUserRegisterForm)}
        className="px-5 py-20 mt-10 space-y-10 bg-white rounded-lg"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-2xl text-slate-500">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario: sin espacios"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("handle", { required: "El handle es obligatorio" })}
          />
          {errors.handle && (
            <ErrorMessage>{errors.handle.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "Contraseña muy corta. Mínimo 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label
            htmlFor="password_confirmation"
            className="text-2xl text-slate-500"
          >
            Repetir Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Repetir Password"
            className="p-3 border-none rounded-lg bg-slate-100 placeholder-slate-400"
            {...register("password_confirmation", {
              required: "Confirma la contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no son iguales",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          className="w-full p-3 text-lg font-bold uppercase rounded-lg cursor-pointer bg-cyan-400 text-slate-600"
          value="Crear Cuenta"
        />
      </form>

      <nav className="mt-10">
        <Link className="block text-lg text-center text-white" to="/auth/login">
          ¿Ya tienes cuenta? Inicia sesión aquí
        </Link>
      </nav>
    </>
  );
}
