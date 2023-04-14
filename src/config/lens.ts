import { LensConfig, appId, production } from '@lens-protocol/react-web';
import { bindings } from '@lens-protocol/wagmi';

export const lensConfig: LensConfig = {
  bindings: bindings(),
  environment: production,
  appId: appId('my-app-id'),
};
