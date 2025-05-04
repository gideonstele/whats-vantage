import styled from '@emotion/styled';
import { Tag, Tooltip } from 'antd';

import { IconType } from 'types/react';

interface StatusValueProps {
  title: string;
  tooltip: string;
}

export interface StatusItemProps {
  value?: boolean;
  trueValue: StatusValueProps;
  falseValue?: StatusValueProps;
  color?: string;
  falseColor?: string;
  falseTextColor?: string;
  hiddenFalse?: boolean;
  Icon?: IconType;
}

const StyledTag = styled(Tag, {
  shouldForwardProp: (prop) =>
    prop !== '$active' && prop !== '$color' && prop !== '$falseColor' && prop !== '$falseTextColor',
})<{ $active: boolean; $color?: string; $falseColor?: string; $falseTextColor?: string }>(
  ({ $active, $color, $falseColor, $falseTextColor }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'default',
    backgroundColor: $active ? ($color ? $color : '#1677ff') : $falseColor ? $falseColor : '#f5f5f5',
    color: $active ? '#fff' : $falseTextColor ? $falseTextColor : '#666',
    border: 'none',
    boxShadow: $active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    transition: 'all 0.3s',
  }),
);

export const StatusItem = ({
  value = false,
  trueValue,
  falseValue,
  color,
  falseColor,
  falseTextColor,
  Icon,
  hiddenFalse = false,
}: StatusItemProps) => {
  const displayValue = value ? trueValue : falseValue;

  if (!displayValue || (hiddenFalse && !value)) return null;

  return (
    <Tooltip title={displayValue.tooltip}>
      <StyledTag
        $active={value}
        $color={color}
        $falseColor={falseColor}
        $falseTextColor={falseTextColor}
      >
        {Icon && <Icon size={14} />}
        {displayValue.title}
      </StyledTag>
    </Tooltip>
  );
};
