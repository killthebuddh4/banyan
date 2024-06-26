import * as Comlink from "comlink";
import { Actions } from "../remote/Actions.js";
import XmtpRemote from "../remote/worker.js?worker&inline";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";

const REMOTES: Record<string, Actions | undefined> = {};

export const useRemoteActions = (props: { wallet?: Signer }) => {
  const proxy = useMemo(() => {
    if (props.wallet === undefined) {
      return null;
    }

    return Comlink.proxy(props.wallet);
    // Getting a little sketchy with the dependencies we don't want to
    // force users to be super careful about what they pass in.
  }, [props.wallet === undefined, props.wallet?.address]);

  const remote = useMemo(() => {
    if (proxy === null) {
      return null;
    }

    if (REMOTES[proxy.address] === undefined) {
      REMOTES[proxy.address] = Comlink.wrap(new XmtpRemote());
    }

    return REMOTES[proxy.address] as Actions;
  }, [proxy]);

  const startClient = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (proxy === null) {
      return null;
    }

    const cb = async () => {
      return remote.startClient(proxy);
    };

    return cb;
  }, [remote, proxy]);

  const stopClient = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.stopClient = async () => {
      return remote.stopClient();
    };

    return cb;
  }, [remote]);

  const fetchState = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.fetchState = async () => {
      return remote.fetchState();
    };

    return cb;
  }, [remote]);

  const subscribeToState = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.subscribeToState = async (cb) => {
      return remote.subscribeToState(Comlink.proxy(cb));
    };

    return cb;
  }, [remote]);

  const unsubscribeToState = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.unsubscribeToState = async (cb) => {
      return remote.unsubscribeToState(Comlink.proxy(cb));
    };

    return cb;
  }, [remote]);

  const startGlobalMessageStream = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.startGlobalMessageStream = async () => {
      return remote.startGlobalMessageStream();
    };

    return cb;
  }, [remote]);

  const listenToGlobalMessageStream = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.listenToGlobalMessageStream = async (cb) => {
      return remote.listenToGlobalMessageStream(Comlink.proxy(cb));
    };

    return cb;
  }, [remote]);

  const sendMessage = useMemo(() => {
    if (remote === null) {
      return null;
    }

    const cb: typeof remote.sendMessage = async (message) => {
      return remote.sendMessage(message);
    };

    return cb;
  }, [remote]);

  return {
    startClient,
    stopClient,
    fetchState,
    subscribeToState,
    unsubscribeToState,
    startGlobalMessageStream,
    listenToGlobalMessageStream,
    sendMessage,
  };
};
