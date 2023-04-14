'use client';

import { LitProvider } from '@/components';
import { lensConfig } from '@/config/lens';
import { litConfig } from '@/config/lit';
import { chains, wagmiClient } from '@/config/wagmi';
import { LensProvider } from '@lens-protocol/react-web';
import { Container } from '@mui/material';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <LensProvider config={lensConfig}>
          <LitProvider config={litConfig}>
            <Container>{children}</Container>
          </LitProvider>
        </LensProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}