import { ComponentType, createContext, memo, PropsWithChildren, useContext, useMemo, useState } from 'react';
import useEvent from 'react-use-event-hook';

export interface ClosableModalDefaultProps {
  tabKey?: string;
  tabKeyChange: (tabKey: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ModalContextType {
  open: (modalId: string, tabKey?: string) => void;
  close: (modalId?: string) => void;
}

const ModalContext = createContext<ModalContextType>({
  open: () => {},
  close: () => {},
});

type ModalContextMap = Record<string, ComponentType<ClosableModalDefaultProps>>;

export const ModalsControllerProvider = memo(
  <Map extends ModalContextMap>({ children, modals }: PropsWithChildren<{ modals: Map }>) => {
    const [openedModalId, setOpenedModalId] = useState<keyof Map | undefined>();
    const [openedModalTabKey, setOpenedModalTabKey] = useState<string | undefined>();

    const open = useEvent((modal: keyof Map, tabKey?: string) => {
      setOpenedModalId(modal);
      setOpenedModalTabKey(tabKey);
    });

    const close = useEvent((modal?: keyof Map) => {
      if (!modal || (modal && openedModalId === modal)) {
        setOpenedModalId(undefined);
      }
    });

    const closeCurrentModal = useEvent(() => {
      setOpenedModalId(undefined);
    });

    const modalRender = useMemo(() => {
      if (!openedModalId) {
        return null;
      }

      const ModalComponent = modals[openedModalId] as ComponentType<ClosableModalDefaultProps>;

      if (!ModalComponent) {
        return null;
      }

      return (
        <ModalComponent
          tabKey={openedModalTabKey}
          tabKeyChange={setOpenedModalTabKey}
          isOpen
          onClose={closeCurrentModal}
        />
      );
    }, [closeCurrentModal, modals, openedModalId, openedModalTabKey]);

    return (
      <ModalContext.Provider value={{ open, close }}>
        {modalRender}
        {children}
      </ModalContext.Provider>
    );
  },
);

export const useModalController = <Map extends ModalContextMap = ModalContextMap>(
  modalId: keyof Map,
  tabKey?: string,
) => {
  const { open, close } = useContext(ModalContext);

  return useMemo(
    () => ({
      open: () => open(modalId as string, tabKey),
      close: () => close(modalId as string),
    }),
    [open, close, modalId, tabKey],
  );
};
