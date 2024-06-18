import { AsyncState } from "./AsyncState";

export type AsyncHandler<T> = (state: AsyncState<T>) => void;
