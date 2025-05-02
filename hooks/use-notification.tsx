import { createContext, PropsWithChildren, useContext } from 'react';

import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  return (
    <NotificationContext.Provider value={notificationApi}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const notificationApi = useContext(NotificationContext);
  if (!notificationApi) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return notificationApi;
};
