import { baseApi } from "src/shared/api/base-api";
import { setAccessToken } from "src/shared/api/api-instance";
import { clearUser } from "src/entities/user/model/user-slice";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "post",
        body: credentials,
      }),
      invalidatesTags: ["Session"],
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        setAccessToken(data.accessToken);
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "post" }),
      invalidatesTags: ["Session"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearUser());
        setAccessToken(null);
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = sessionApi;
