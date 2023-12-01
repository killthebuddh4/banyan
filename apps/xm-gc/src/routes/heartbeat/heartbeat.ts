export const heartbeat = async () => {
  return {
    ok: true,
    result: {
      heartbeat: true,
    },
  } as const;
};
