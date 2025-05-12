import dayjs from 'dayjs';

import { useEffect, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Button, Flex, Typography } from 'antd';
import { StopCircleIcon, TicketMinusIcon } from 'lucide-react';

import { useMessage } from '@hooks/use-message';
import { sendMessageToWppInjected } from '@services/injected-messager';

import { StyledScheduledContainer } from '../../styled';

interface ScheduledTimeTimerProps {
  scheduledTime: string;
  contactCount: number;
}

export const ScheduledTimeTimer = ({ scheduledTime, contactCount }: ScheduledTimeTimerProps) => {
  const time = useMemo(() => dayjs(scheduledTime, 'HH:mm'), [scheduledTime]);

  const messageApi = useMessage();

  const now = dayjs();
  const [remainingTime, setRemainingTime] = useState(time.diff(now, 'minute'));

  const stopSend = useMemoizedFn(async () => {
    await sendMessageToWppInjected('injected:stop-send-message', undefined);
    messageApi.success('已停止发送');
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = time.diff(now, 'second');
      if (remainingTime > 0) {
        setRemainingTime(remainingTime);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time, now]);

  return (
    <StyledScheduledContainer>
      <Flex
        align="center"
        gap={8}
      >
        <TicketMinusIcon size={18} />
        <Typography.Text strong>{scheduledTime} 定时发送</Typography.Text>
      </Flex>
      <Typography.Text type="secondary">
        将发送给 {contactCount} 个联系人， 还有 {remainingTime} 秒
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
};
