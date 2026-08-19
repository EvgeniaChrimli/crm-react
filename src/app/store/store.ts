import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "src/shared/api/base-api";
import userReducer from "src/entities/user/model/user-slice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
