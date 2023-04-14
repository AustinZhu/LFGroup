import { Signer } from 'ethers';
import { createContext, useContext } from 'react';

interface AppContextValues {
  signer: Signer | undefined;
  setSigner: (signer: Signer | undefined) => void;
}

export const AppContext = createContext<AppContextValues>({
  signer: undefined,
  setSigner: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
}