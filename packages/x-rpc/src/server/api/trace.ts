import { Server } from "../Server.js";
import { Metadata } from "../Metadata.js";

export const trace = ({
  server,
  metadata,
  tracer,
}: {
  server: Server;
  metadata: Metadata;
  tracer: {
    id: string;
    onInput: (input: unknown) => void;
    onOutput: (output: unknown) => void;
  };
}) => {
  const handler = server.handlers.get(metadata.handler.id);

  if (handler === undefined) {
    throw new Error("handler not found");
  }

  handler.tracers.set(tracer.id, {
    onInput: tracer.onInput,
    onOutput: tracer.onOutput,
  });

  return () => {
    handler.tracers.delete(tracer.id);
  };
};
