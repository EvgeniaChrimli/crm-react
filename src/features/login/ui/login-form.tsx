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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          email
          <input type="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </label>
        <label>
          pass
          <input type="password" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "loading" : "send"}
        </button>
      </form>
      {errors.root && (
        <div>
          <span>{errors.root.type}</span>
          <span>{errors.root.message}</span>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
