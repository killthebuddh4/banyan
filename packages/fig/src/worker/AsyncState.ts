type AsyncInactive = {
  id: "inactive";
  data?: undefined;
  error?: undefined;
};

type AsyncIdle = {
  id: "idle";
  data?: undefined;
  error?: undefined;
};

type AsyncPending = {
  id: "pending";
  data?: undefined;
  error?: undefined;
};

type AsyncSuccess<T> = {
  id: "success";
  data: T;
  error?: undefined;
};

type AsyncFetching<T> = {
  id: "fetching";
  data: T;
  error?: undefined;
};

type AsyncError = {
  id: "error";
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
