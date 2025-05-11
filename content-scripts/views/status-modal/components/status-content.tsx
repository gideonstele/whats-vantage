import { memo, useState } from 'react';

import { Button, Typography } from 'antd';
import { ListCollapseIcon } from 'lucide-react';

import { SendMessageProcessingState } from '@content-scripts/external-stores/send-message-processing';

import { CurrentTask } from './current-task';
import { Statistics } from './statistics';
import {
  StyledAutoSendStatusCollapsed,
  StyledAutoSendStatusRoot,
  StyledProgressBar,
  StyledStatusHeader,
} from './styled';

interface StatusContentProps {
  state: SendMessageProcessingState;
}

export const StatusContent = memo(({ state }: StatusContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <StyledAutoSendStatusCollapsed>
        <Button
          type="link"
          icon={<ListCollapseIcon />}
          onClick={() => setIsCollapsed(false)}
        ></Button>
      </StyledAutoSendStatusCollapsed>
    );
  }

  return (
    <StyledAutoSendStatusRoot>
      <StyledStatusHeader>
        <Typography.Text strong>消息发送状态</Typography.Text>
        <Button
          type="link"
          icon={<ListCollapseIcon />}
          onClick={() => setIsCollapsed(true)}
        ></Button>
      </StyledStatusHeader>
      <CurrentTask state={state} />
      <Statistics state={state} />
      {state.isPending && <StyledProgressBar />}
    </StyledAutoSendStatusRoot>
  );
});
