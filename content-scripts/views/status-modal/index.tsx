import { memo } from 'react';

import { useSendMessageProcessingState } from '@content-scripts/external-stores/send-message-processing';

import { StatusContent } from './components/status-content';

export const AutoSendStatusModal = memo(() => {
  const state = useSendMessageProcessingState();

  // 如果没有正在发送的消息或者定时任务，不显示状态框
  if (!state.isPending && !state.scheduledTime) {
    return null;
  }

  return <StatusContent state={state} />;
});
