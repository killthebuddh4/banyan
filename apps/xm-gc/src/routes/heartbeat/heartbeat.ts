export const heartbeat = async () => {
  return (async function* () {
    while (true) {
      yield {
        ok: true,
        result: {
          heartbeat: true,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  })();
};
