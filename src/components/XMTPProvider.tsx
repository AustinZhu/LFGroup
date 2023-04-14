import { XMTPContext } from '@/hooks/useXMTP';
import { Client, ClientOptions } from '@xmtp/xmtp-js';
import { PropsWithChildren, useState } from 'react';

export type XMTPProviderProps = PropsWithChildren<Record<'config', Partial<ClientOptions>>>;

const XMTPProvider = (props: XMTPProviderProps) => {
  const [xmtp, setXMTP] = useState<Client>();

  return (
    <XMTPContext.Provider
      value={{
        client: xmtp,
        setClient: setXMTP,
        config: props.config,
      }}
    >
      {props.children}
    </XMTPContext.Provider>
  );
};

export default XMTPProvider;
