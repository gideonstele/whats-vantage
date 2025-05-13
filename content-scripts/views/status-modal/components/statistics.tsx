import { useMemo } from 'react';

import { Badge, Typography } from 'antd';

import { SendMessageProcessingState } from '@content-scripts/external-stores/send-message-processing';

import { StyledStatisticItem, StyledStatisticsContainer } from './styled';

interface StatisticsProps {
  state: SendMessageProcessingState;
}

export const Statistics = ({ state }: StatisticsProps) => {
  const statisticsRender = useMemo(() => {
    return (
      <StyledStatisticsContainer>
        <StyledStatisticItem>
          <Badge status="success" />
          <Typography.Text type="secondary">成功</Typography.Text>
          <Typography.Text
            strong
            style={{ color: '#52c41a' }}
          >
            {state.success?.length ?? 0}
          </Typography.Text>
        </StyledStatisticItem>
        <StyledStatisticItem>
          <Badge status="error" />
          <Typography.Text type="secondary">失败</Typography.Text>
          <Typography.Text
            strong
            style={{ color: '#ff4d4f' }}
          >
            {state.error?.length ?? 0}
          </Typography.Text>
        </StyledStatisticItem>
        <StyledStatisticItem>
          <Badge status="processing" />
          <Typography.Text type="secondary">待处理</Typography.Text>
          <Typography.Text
            strong
            style={{ color: '#1890ff' }}
          >
            {state.remaining?.length ?? 0}
          </Typography.Text>
        </StyledStatisticItem>
      </StyledStatisticsContainer>
    );
  }, [state]);

  return statisticsRender;
};
