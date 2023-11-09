import { Processor } from "./Processor.js";

export const create = <Mem>({
  core,
}: {
  core: Processor<Mem>;
}): Processor<Mem> => {
  return async function* ({ io, memory }) {
    yield io.create({
      event: "node-start",
      data: {},
    });

    for await (const output of core({ io, memory })) {
      yield output;
    }

    yield io.create({
      event: "node-end",
      data: {},
    });
  };
};
