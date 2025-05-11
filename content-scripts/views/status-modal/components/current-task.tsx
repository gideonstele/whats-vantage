import dayjs from 'dayjs';

import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Avatar, Button, Flex, Typography } from 'antd';
import { SendIcon, StopCircleIcon, TicketMinusIcon } from 'lucide-react';

import { SendMessageProcessingState } from '@content-scripts/external-stores/send-message-processing';
import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';

import { StyledContactInfo, StyledCurrentTaskContainer, StyledScheduledContainer } from './styled';

interface CurrentTaskProps {
  state: SendMessageProcessingState;
}

export const CurrentTask = ({ state }: CurrentTaskProps) => {
  const messageApi = useMessage();

  const stopSend = useMemoizedFn(async () => {
    await sendMessageToWppInjected('injected:stop-send-message', undefined);
    messageApi.success('已停止发送');
  });

  const currentTaskRender = useMemo(() => {
    // 显示定时发送状态
    if (state.scheduledTime && state.contactCount) {
      const now = dayjs();
      const scheduledTime = dayjs()
        .hour(parseInt(state.scheduledTime.split(':')[0]))
        .minute(parseInt(state.scheduledTime.split(':')[1]))
        .second(0);
      const remainingTime = scheduledTime.diff(now, 'minute');

      return (
        <StyledScheduledContainer>
          <Flex
            align="center"
            gap={8}
          >
            <TicketMinusIcon size={18} />
            <Typography.Text strong>{state.scheduledTime} 定时发送</Typography.Text>
          </Flex>
          <Typography.Text type="secondary">
            将发送给 {state.contactCount} 个联系人， 还有 {remainingTime} 分钟
          </Typography.Text>
          <Button
            type="primary"
            size="small"
            danger
            icon={<StopCircleIcon />}
            onClick={stopSend}
          >
            取消定时发送
          </Button>
        </StyledScheduledContainer>
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
  }, [state, stopSend]);

  return currentTaskRender;
};
