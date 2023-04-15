import * as PushAPI from '@pushprotocol/restapi';
import { Signer, Wallet } from 'ethers';
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react';

interface PushContextValues {
  user: PushAPI.IUser | undefined;
  setUser: Dispatch<SetStateAction<PushAPI.IUser | undefined>>;
  key: string | undefined;
  setKey: Dispatch<SetStateAction<string | undefined>>;
}

export const PushContext = createContext<PushContextValues>({
  user: undefined,
  setUser: () => {},
  key: undefined,
  setKey: () => {},
});

export const usePushConnect = () => {
  const { setUser, key, setKey } = useContext(PushContext);
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(key !== undefined);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error>();

  const connect = async (signer: Signer) => {
    try {
      setIsPending(true);

      let user: PushAPI.IUser;
      try {
        user = await PushAPI.user.create({
          account: `eip155:${await signer.getAddress()}`,
        });
      } catch (e) {
        console.log('User already exists');
        
        user = await PushAPI.user.get({
          account: `eip155:${await signer.getAddress()}`,
        });
      }

      const decryptedPvtKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        signer: signer as Wallet,
      });
      setUser(user);
      setKey(decryptedPvtKey);

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
    connect: useCallback(connect, [setKey, setUser]),
    isPending,
    isConnected,
    isError,
    error,
  };
};

export const usePush = () => {
  const { user, key } = useContext(PushContext);

  return {
    user,
    key,
  };
};
