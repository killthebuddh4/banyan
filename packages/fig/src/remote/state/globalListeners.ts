import { v4 as uuid } from "uuid";

const listeners = new Map<string, { ignore: () => void }>();

export const add = (listener: () => void) => {
  const id = uuid();

  listeners.set(id, { ignore: listener });

  return id;
};

export const remove = (id: string) => {
  const listener = listeners.get(id);

  if (!listener) {
    return false;
  }

  listener.ignore();

  listeners.delete(id);

  return true;
};
