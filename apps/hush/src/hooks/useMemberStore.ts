import { Whisper } from "@/lib/Whisper";
import { create } from "zustand";
import { Signer } from "@killthebuddha/fig";

export const useMemberStore = create<{
  alias: string | null;
  aliasInput: string;
  messageInput: string;
  wallet: Signer | undefined;
  isSending: boolean;
  messages: Whisper[];
  owner: { address: string; alias: string; lastSeen: number } | null;
  isJoining: boolean;
  isJoined: boolean;
}>(() => ({
  alias: null,
  aliasInput: "",
  messageInput: "",
  wallet: undefined,
  isSending: false,
  messages: [],
  owner: null,
  isJoining: false,
  isJoined: false,
}));
