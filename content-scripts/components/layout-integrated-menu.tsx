import { PropsWithChildren } from 'react';

import { PortalDomContainer, useWhatsAppHeaderDom } from '../dom/external';

export const IntegratedMenuLayout = ({ children }: PropsWithChildren) => {
  return <PortalDomContainer useDomHooks={useWhatsAppHeaderDom}>{children}</PortalDomContainer>;
};
