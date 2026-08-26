import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/store/hooks";
import { useLoginMutation } from "src/entities/session/api/api";
import { userApi } from "src/entities/user/api/api";
import { ROUTES } from "src/shared/config/routes";
import { loginSchema, type LoginFormData } from "../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosBaseQueryError } from "src/shared/types";
import "./login-form.css";

type LoginError = {
  message: string;
};
const LoginForm = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      const user = await dispatch(userApi.endpoints.getMe.initiate()).unwrap();
      navigate(user.role === "admin" ? ROUTES.admin : ROUTES.app);
    } catch (error) {
      const apiError = error as AxiosBaseQueryError;
      const loginErrror = apiError.data as LoginError;

      setError("root", {
        type: String(apiError.status),
        message: loginErrror.message,
      });
    }
  };
  return (
    <div className="background-card">
      <form
        className="flex flex-col gap-3 justify-center p-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <p className="login-form__title">Войдите, чтобы продолжить</p>
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="login-form__input"
            placeholder="example@mail.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <span className="login-form__error">{errors.email?.message}</span>
        </div>
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="login-form__input"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <span className="login-form__error">{errors.password?.message}</span>
        </div>
        <button
          className="login-form__submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "загрузка..." : "Отправить"}
        </button>
        <span className="login-form__server-error">{errors.root?.message}</span>
      </form>
    </div>
  );
};

export default LoginForm;
