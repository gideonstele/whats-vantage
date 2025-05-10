import { Tooltip } from 'antd';

import { StyledTagItem } from './styled';

export interface TagsBarItemProps {
  value: string;
  label?: string;
  onClick?: () => void;
  'data-tag-value'?: string;
}

export const TagsBarItem = ({ value, label, onClick, 'data-tag-value': dataTagValue }: TagsBarItemProps) => {
  return (
    <Tooltip
      title={value}
      placement="bottom"
      mouseEnterDelay={0.5}
    >
      <StyledTagItem
        data-tag-value={dataTagValue}
        onClick={onClick}
      >
        {label || value}
      </StyledTagItem>
    </Tooltip>
  );
};
