import { browser } from '#imports';

import { useMemo } from 'react';

import { Button } from 'antd';
import { DownloadIcon } from 'lucide-react';

export const DownloadTemplateButton = () => {
  const href = useMemo(() => browser.runtime.getURL('/contact-template.xlsx'), []);

  return (
    <Button
      variant="link"
      color="default"
      icon={<DownloadIcon />}
      href={href}
      download="sw-wpp-contact-template.xlsx"
    >
      下载联系人模板
    </Button>
  );
};
