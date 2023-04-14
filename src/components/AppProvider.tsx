import { AppContext } from '@/hooks/useAppContext';
import { Signer } from 'ethers';
import { PropsWithChildren, useState } from 'react';

const AppProvider = ({ children }: PropsWithChildren) => {
  const [signer, setSigner] = useState<Signer>();

  return (
    <AppContext.Provider
      value={{
        signer,
        setSigner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;