type AsyncInactive = {
  code: "inactive";
  data?: undefined;
  error?: undefined;
};

type AsyncIdle = {
  code: "idle";
  data?: undefined;
  error?: undefined;
};

type AsyncPending = {
  code: "pending";
  data?: undefined;
  error?: undefined;
};

type AsyncSuccess<T> = {
  code: "success";
  data: T;
  error?: undefined;
};

type AsyncFetching<T> = {
  code: "fetching";
  data: T;
  error?: undefined;
};

type AsyncError = {
  code: "error";
  error: string;
  data?: undefined;
};

export type AsyncState<T> =
  | AsyncInactive
  | AsyncIdle
  | AsyncPending
  | AsyncFetching<T>
  | AsyncSuccess<T>
  | AsyncError;
