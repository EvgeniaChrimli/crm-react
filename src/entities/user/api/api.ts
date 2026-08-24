import { baseApi } from "src/shared/api/base-api";
import { clearUser, setUser } from "../model/user-slice";
import type { User } from "../model/user-types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.mutation<User, void>({
      query: () => ({ url: "/auth/me", method: "get" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearUser());
        }
      },
    }),
  }),
});

export const { useGetMeMutation } = userApi;
