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

export interface FilterContactPhoneNumberProps extends FilterDropdownProps {
  setSearchPhoneNumber?: (phoneNumber: string) => void;
  initialValue?: string;
}

export const FilterContactPhoneNumber = ({
  confirm,
  setSearchPhoneNumber,
  initialValue = '',
}: FilterContactPhoneNumberProps) => {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);

  const onPhoneNumberChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  });

  const onConfirm = useMemoizedFn(() => {
    setSearchPhoneNumber?.(phoneNumber);
    confirm?.({
      closeDropdown: true,
    });
  });

  const reset = useMemoizedFn(() => {
    setPhoneNumber('');
    setSearchPhoneNumber?.('');
  });

  return (
    <StyledWrapper>
      <Input
        placeholder="输入联系电话"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
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
