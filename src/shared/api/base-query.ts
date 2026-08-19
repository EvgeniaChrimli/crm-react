import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { axiosInstance } from "./api-instance";
import type { AxiosError, AxiosRequestConfig } from "axios";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  body?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

type AxiosBaseQueryError = {
  status?: number;
  data: unknown;
};

export function axiosBaseQuery(): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> {
  return async ({ url, method, body, params }) => {
    try {
      const result = await axiosInstance({ url, method, data: body, params });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
}
