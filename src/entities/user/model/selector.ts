import type { RootState } from "src/app/store/store";

export const selectUser = (state: RootState) => state.user.user;
export const selectRole = (state: RootState) => state.user.user?.role;
export const selectIsAuth = (state: RootState) => Boolean(state.user.user);
