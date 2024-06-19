import { AsyncState } from "./AsyncState.js";

export type AsyncHandler<T> = (state: AsyncState<T>) => void;
