import { useState } from 'react';

import { ModalBodyViewLayout } from '../_/layout';

import { ContactTable } from './components/contact-table';
import { FooterOperations } from './components/footer-operations';
import { HeaderOperations } from './components/header-operations';

export const ContactsManagementView = () => {
  const [viewRef, setViewRef] = useState<HTMLDivElement | undefined>();

  return (
    <ModalBodyViewLayout ref={(el) => setViewRef(el as HTMLDivElement)}>
      <HeaderOperations />
      <ContactTable viewRef={viewRef} />
      <FooterOperations viewRef={viewRef} />
    </ModalBodyViewLayout>
  );
};
