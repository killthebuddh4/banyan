import { Memory } from "../memory/Memory.js";
import { MMap } from "../memory/MMap.js";
import { Processor } from "../processor/Processor.js";
import { Socket } from "../io/socket/Socket.js";
import { Executable } from "./Executable.js";

export type Compile = <M>({
  memory,
  stdin,
  stdout,
  mmap,
  processor,
}: {
  memory: Memory;
  stdin: Socket;
  stdout: Socket;
  mmap: MMap<M>;
  processor: Processor<M>;
}) => Executable;
