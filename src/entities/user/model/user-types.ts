export type Role = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: Role;
  branch: number | null;
}
