import { PushContext } from '@/hooks/usePush';
import { IUser } from '@pushprotocol/restapi';
import { PropsWithChildren, useState } from 'react';

export type PushProviderProps = PropsWithChildren;

const PushProvider = (props: PushProviderProps) => {
  const [user, setUser] = useState<IUser>();
  const [key, setKey] = useState<string>();

  return (
    <PushContext.Provider
      value={{
        user: user,
        setUser: setUser,
        key: key,
        setKey: setKey,
      }}
    >
      {props.children}
    </PushContext.Provider>
  );
};

export default PushProvider;
