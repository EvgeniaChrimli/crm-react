import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, "Введите e-mail"),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(8, "Пароль должен содержать минимум 8 символов"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
