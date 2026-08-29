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

type LoginError = {
  message: string;
};

const inputClasses =
  "w-full mt-[5px] p-2 rounded-card border border-transparent bg-light text-dark text-sm shadow-soft transition-[border-color,box-shadow] duration-200 ease-in-out placeholder:text-dark/50 focus:outline-none focus:border-dark focus:ring-3 focus:ring-dark/12 aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/12";

const errorClasses = "block min-h-4 text-xs leading-4 text-error";
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
        <p className="text-xl font-semibold mb-2.5 text-dark">
          Войдите, чтобы продолжить
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-dark text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClasses}
            placeholder="example@mail.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <span
            className={`${errorClasses} ${errors.email?.message ? "animate-error-in" : ""}`}
          >
            {errors.email?.message}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-dark text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={inputClasses}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <span
            className={`${errorClasses} ${errors.password?.message ? "animate-error-in" : ""}`}
          >
            {errors.password?.message}
          </span>
        </div>
        <button
          className="w-full p-2.5 mt-5 rounded-card border-0 bg-dark text-light font-semibold cursor-pointer transition-[background-color,box-shadow,transform] duration-200 ease-in-out hover:enabled:bg-dark-hover hover:enabled:shadow-button-hover active:enabled:scale-[0.97] active:enabled:bg-dark-active disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "загрузка..." : "Отправить"}
        </button>
        <span className="block min-h-4 mt-2 text-[13px] text-dark/50 text-center">
          {errors.root?.message}
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
