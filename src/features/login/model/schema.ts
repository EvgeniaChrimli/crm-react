import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Введите e-mail")
    .email("Введите корректный e-mail"),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(8, "Пароль должен содержать минимум 8 символов"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
