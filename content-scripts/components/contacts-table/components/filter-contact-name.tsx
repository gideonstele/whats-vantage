import { ChangeEvent, useState } from 'react';

import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import { Button, Flex, Input } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';

const StyledWrapper = styled.section({
  width: 260,
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export interface FilterContactNameProps extends FilterDropdownProps {
  setSearchName?: (name: string) => void;
  initialValue?: string;
}

export const FilterContactName = ({ confirm, setSearchName, initialValue = '' }: FilterContactNameProps) => {
  const [name, setName] = useState(initialValue);

  const onNameChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  });

  const reset = useMemoizedFn(() => {
    setName('');
    setSearchName?.('');
  });

  const onConfirm = useMemoizedFn(() => {
    setSearchName?.(name);
    confirm?.({
      closeDropdown: true,
    });
  });

  return (
    <StyledWrapper>
      <Input
        placeholder="输入联系人名称"
        value={name}
        onChange={onNameChange}
        allowClear
      />
      <Flex
        justify="end"
        gap={5}
      >
        <Button
          size="small"
          onClick={reset}
          type="primary"
        >
          重置
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={onConfirm}
        >
          确定
        </Button>
      </Flex>
    </StyledWrapper>
  );
};
