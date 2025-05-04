import { createContext, PropsWithChildren, useContext } from 'react';

import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';

const MessageContext = createContext<MessageInstance | null>(null);

export const MessageProvider = ({ children }: PropsWithChildren) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const messageApi = useContext(MessageContext);
  if (!messageApi) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return messageApi;
};
