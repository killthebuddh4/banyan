import { createGroupServer } from "../../lib/createGroupServer.js";
import { db } from "../../lib/db.js";
import { cacheStore } from "../../cache/cacheStore.js";
import { addGroupServer } from "../../cache/addGroupServer.js";

export const createGroup = async ({
  userDoingTheCreating,
  name,
  description,
}: {
  userDoingTheCreating: {
    address: string;
  };
  name: string;
  description: string;
}) => {
  try {
    await db.user.create({
      data: {
        address: userDoingTheCreating.address,
      },
    });
  } catch (error) {
    // TODO: Check if the error is because the user already exists
  }

  const groupServer = await createGroupServer({
    ownerAddress: userDoingTheCreating.address,
    name,
    description,
  });

  const created = await db.group.create({
    data: {
      address: groupServer.client.address,
      name,
      description,
      creator: {
        connect: {
          address: userDoingTheCreating.address,
        },
      },
      owner: {
        connect: {
          address: userDoingTheCreating.address,
        },
      },
      members: {
        create: {
          user: {
            connect: {
              address: userDoingTheCreating.address,
            },
          },
        },
      },
    },
  });

  addGroupServer({
    store: cacheStore,
    groupServer,
  });

  return {
    ok: true,
    result: {
      createdGroup: { address: created.address },
    },
  } as const;
};
