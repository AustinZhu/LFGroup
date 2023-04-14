import { LitContext } from '@/hooks/useLit';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNodeClientConfig } from '@lit-protocol/types';
import { PropsWithChildren, useState } from 'react';

export type LitProviderProps = PropsWithChildren<Record<'config', Partial<LitNodeClientConfig>>>;

const LitProvider = (props: LitProviderProps) => {
  const [litClient, setLitClient] = useState<LitNodeClient>();

  return (
    <LitContext.Provider
      value={{
        client: litClient,
        setClient: setLitClient,
        config: props.config,
      }}
    >
      {props.children}
    </LitContext.Provider>
  );
};

export default LitProvider;