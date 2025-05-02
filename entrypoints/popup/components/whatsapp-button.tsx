import { openOrSwitchToTab } from '@utils/open-or-switch-to-tab';

import { StyledButton } from './button.styled';

export const WhatsAppButton = () => {
  const handleOpenWhatsApp = async () => {
    openOrSwitchToTab('https://web.whatsapp.com');

    // Close the popup
    window.close();
  };

  return <StyledButton onClick={handleOpenWhatsApp}>打开WhatsApp</StyledButton>;
};
