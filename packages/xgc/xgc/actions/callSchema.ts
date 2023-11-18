import { z } from "zod";
import { callSchema as createChannelSchema } from "./create-channel/callSchema.js";
import { callSchema as inviteMemberToChannelSchema } from "./invite-member-to-channel/callSchema.js";
import { callSchema as acceptChannelInviteSchema } from "./accept-channel-invite/callSchema.js";
import { callSchema as declineChannelInviteSchema } from "./decline-channel-invite/callSchema.js";
import { callSchema as deleteChannelSchema } from "./delete-channel/callSchema.js";
import { callSchema as removeMemberFromChannelSchema } from "./remove-member-from-channel/callSchema.js";
import { callSchema as listCreatedChannelsSchema } from "./list-created-channels/callSchema.js";
import { callSchema as listAvailableCommandsSchema } from "./list-available-commands/callSchema.js";
import { callSchema as describeChannelSchema } from "./describe-channel/callSchema.js";

export const callSchema = z.union([
  createChannelSchema,
  inviteMemberToChannelSchema,
  acceptChannelInviteSchema,
  declineChannelInviteSchema,
  deleteChannelSchema,
  removeMemberFromChannelSchema,
  listCreatedChannelsSchema,
  listAvailableCommandsSchema,
  describeChannelSchema,
]);
