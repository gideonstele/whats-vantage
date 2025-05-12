import { useMemoizedFn } from 'ahooks';
import { Avatar, Button, Typography } from 'antd';
import { SendIcon, StopCircleIcon } from 'lucide-react';

import { SendMessageProcessingState } from '@content-scripts/external-stores/send-message-processing';
import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';

import { StyledContactInfo, StyledCurrentTaskContainer } from '../styled';

import { ScheduledTimeTimer } from './components/scheduled-time-timer';

interface CurrentTaskProps {
  state: SendMessageProcessingState;
}

export const CurrentTask = ({ state }: CurrentTaskProps) => {
  const messageApi = useMessage();

  const stopSend = useMemoizedFn(async () => {
    await sendMessageToWppInjected('injected:stop-send-message', undefined);
    messageApi.success('已停止发送');
  });

  if (state.scheduledTime && state.contactCount) {
    return (
      <ScheduledTimeTimer
        scheduledTime={state.scheduledTime}
        contactCount={state.contactCount}
      />
    );
  }

  // 显示当前正在发送的消息
  if (!state.current?.contact) {
    return null;
  }

  return (
    <StyledCurrentTaskContainer>
      <SendIcon size={18} />
      <Typography.Text type="secondary">正在向</Typography.Text>
      <StyledContactInfo>
        <Avatar
          size="small"
          src={state.current.contact.avatar}
          alt={state.current.contact.name || '用户'}
        />
        <Typography.Text strong>{state.current.contact.name || '用户'}</Typography.Text>
      </StyledContactInfo>
      <Typography.Text type="secondary">发送消息</Typography.Text>
      <Button
        type="primary"
        size="small"
        danger
        icon={<StopCircleIcon />}
        onClick={stopSend}
      >
        停止
      </Button>
    </StyledCurrentTaskContainer>
  );
};
