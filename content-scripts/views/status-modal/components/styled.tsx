import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const progressAnimation = keyframes({
  '0%': {
    width: '0%',
    opacity: 0.8,
  },
  '100%': {
    width: '100%',
    opacity: 0.2,
  },
});

export const StyledAutoSendStatusCollapsed = styled.section`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  top: 12px;
  right: 0;
  width: 32px;
  height: 32px;
`;

export const StyledAutoSendStatusRoot = styled.section`
  /* 容器位置和尺寸 */
  position: fixed;
  z-index: 1000;
  top: 12px;
  right: 12px;
  min-width: 360px;
  max-width: 480px;
  /* 视觉样式 */
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  /* 布局 */
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 效果 */
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const StyledProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: #1890ff;
  animation: ${progressAnimation} 2s infinite linear;
`;

export const StyledStatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

export const StyledCurrentTaskContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

export const StyledContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledStatisticsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;

export const StyledStatisticItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StyledScheduledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;
