/* eslint-disable @typescript-eslint/no-empty-function */
import { Client, ClientOptions } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react';

interface XMTPContextValues {
  client: Client | undefined;
  setClient: Dispatch<SetStateAction<Client | undefined>>;
  config: Partial<ClientOptions>;
}

export const XMTPContext = createContext<XMTPContextValues>({
  client: undefined,
  setClient: () => {},
  config: {},
});

export const useXMTPConnect = (options?: Partial<ClientOptions>) => {
  const { client, setClient, config } = useContext(XMTPContext);
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(client !== undefined);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const connect = async (signer: Signer) => {
    try {
      setIsPending(true);

      const client = await Client.create(signer ?? null, { ...config, ...options });
      setClient(client);

      setIsConnected(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    connect: useCallback(connect, [config, options, setClient]),
    isPending,
    isConnected,
    isError,
    error,
  };
};

export const useXMTPClient = () => {
  const { client } = useContext(XMTPContext);

  return client;
};

export const useXMTPDisconnect = (options?: { force: boolean }) => {
  const { client, setClient } = useContext(XMTPContext);
  const [isPending, setIsPending] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(client === undefined);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const disconnect = async () => {
    if (!client) {
      setIsDisconnected(true);
      return;
    }

    try {
      setIsPending(true);

      await client.close();
      setClient(undefined);

      setIsDisconnected(true);
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setError(e);
      }

      if (options?.force) {
        setClient(undefined);
        setIsDisconnected(true);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    disconnect: useCallback(disconnect, [client, options?.force, setClient]),
    isPending,
    isDisconnected,
    isError,
    error,
  };
};

// export const useXMTPNewConversation = () => {
//   const { client } = useContext(XMTPContext);
//   const [isPending, setIsPending] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState<Error>();

//   const newConversation = async (peerAddress: string, context?: InvitationContext) => {
//     if (!client) {
//       throw new Error('XMTP client is not connected');
//     }

//     try {
//       setIsPending(true);

//       const conversation = await client.conversations.newConversation(peerAddress, context);

//       return conversation;
//     } catch (e) {
//       if (e instanceof Error) {
//         setIsError(true);
//         setError(e);
//       }
//     } finally {
//       setIsPending(false);
//     }

//     return {
//       newConversation: useCallback(newConversation, [client]),
//       isPending,
//       isError,
//       error,
//     };
//   };
// };
