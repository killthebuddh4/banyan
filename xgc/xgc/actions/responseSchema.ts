import { z } from "zod";
import { responseSchema as createChannelResponseSchema } from "./create-channel/responseSchema.js";
import { responseSchema as inviteMemberToChannelSchema } from "./invite-member-to-channel/responseSchema.js";
import { responseSchema as acceptChannelInviteSchema } from "./accept-channel-invite/responseSchema.js";
import { responseSchema as declineChannelInviteSchema } from "./decline-channel-invite/responseSchema.js";
import { responseSchema as deleteChannelSchema } from "./delete-channel/responseSchema.js";
import { responseSchema as removeMemberFromChannelSchema } from "./remove-member-from-channel/responseSchema.js";
import { responseSchema as listCreatedChannelsSchema } from "./list-created-channels/responseSchema.js";
import { responseSchema as listAvailableCommandsSchema } from "./list-available-commands/responseSchema.js";
import { responseSchema as describeChannelSchema } from "./describe-channel/responseSchema.js";

export const responseSchema = z.union([
  createChannelResponseSchema,
  inviteMemberToChannelSchema,
  acceptChannelInviteSchema,
  declineChannelInviteSchema,
  deleteChannelSchema,
  removeMemberFromChannelSchema,
  listCreatedChannelsSchema,
  listAvailableCommandsSchema,
  describeChannelSchema,
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);
