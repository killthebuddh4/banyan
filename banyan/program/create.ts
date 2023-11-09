import { Node } from "../source/Node.js";
import { Runtime } from "../runtime/Runtime.js";
import { Program } from "./Program.js";

export const create = ({
  id,
  source,
  runtime,
}: {
  id: string;
  source: Node[];
  runtime: Runtime;
}): Program => {
  return {
    id,
    source,
    runtime,
    exec: async ({ input }) => {
      const entrypoints = source.filter(
        (node) => node.address === "entrypoint",
      );

      if (entrypoints.length !== 1) {
        throw new Error(`Expected 1 entrypoint, found ${entrypoints.length}`);
      }

      const executable = runtime[entrypoints[0].address];

      if (executable === undefined) {
        throw new Error(`Executable ${entrypoints[0].address} not found`);
      }

      executable.exec({ input });
    },
    link: async () => {
      for (const node of source) {
        const executable = runtime[node.address];

        if (executable === undefined) {
          throw new Error(`Executable ${node.address} not found`);
        }

        const inputNodes = node.inputs.map((address) => {
          const inputNode = source.find((node) => node.address === address);
          if (inputNode === undefined) {
            throw new Error(`Node ${address} not found`);
          }
          return inputNode;
        });

        for (const inputNode of inputNodes) {
          const inputExecutable = runtime[inputNode.address];

          if (inputExecutable === undefined) {
            throw new Error(
              `Executable for input ${inputNode.address} not found`,
            );
          }

          inputExecutable.link({
            handler: async ({ event }) => {
              executable.exec({ input: event });
            },
          });
        }
      }
    },
    trace: async ({ handler }) => {
      for (const executable of Object.values(runtime)) {
        if (executable === undefined) {
          continue;
        }

        executable.trace({
          handler: async ({ outbox, event }) => {
            handler({ outbox, event });
          },
        });
      }
    },
  };
};
