import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import { Button, Checkbox, Divider, Flex, RadioChangeEvent } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';

const StyledWrapper = styled.section({
  width: 220,
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export interface ContactTableFilterDropdownProps extends FilterDropdownProps {
  searchParams?: Record<string, any>;
  setIsMyContactQuery?: (value?: boolean) => void;
  setIsManualAddedQuery?: (value?: boolean) => void;
  setIsBusinessQuery?: (value?: boolean) => void;
  resetQuery?: () => void;
}

export const ContactTableFilterDropdown = ({
  close,
  searchParams = {},
  setIsMyContactQuery,
  setIsManualAddedQuery,
  setIsBusinessQuery,
  resetQuery,
}: ContactTableFilterDropdownProps) => {
  const onMyContactChange = useMemoizedFn((e: RadioChangeEvent) => {
    const isChecked = e.target.checked;
    setIsMyContactQuery?.(isChecked);
  });

  const onManualAddedChange = useMemoizedFn((e: RadioChangeEvent) => {
    const isChecked = e.target.checked;
    setIsManualAddedQuery?.(isChecked);
  });

  const onOnlyBusinessChange = useMemoizedFn((e: RadioChangeEvent) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setIsBusinessQuery?.(true);
    } else {
      setIsBusinessQuery?.(undefined);
    }
  });

  const handleReset = useMemoizedFn(() => {
    if (resetQuery) {
      resetQuery();
    } else {
      setIsMyContactQuery?.(undefined);
      setIsManualAddedQuery?.(undefined);
      setIsBusinessQuery?.(undefined);
    }
  });

  return (
    <StyledWrapper>
      <Flex
        vertical
        gap={5}
      >
        <Checkbox
          name="contacts-table-filter-dropdown-my-contact"
          checked={searchParams.isMyContact}
          onChange={onMyContactChange}
        >
          只看我的联系人
        </Checkbox>
        <Checkbox
          name="contacts-table-filter-dropdown-manual-added"
          checked={searchParams.isManualAdded}
          onChange={onManualAddedChange}
        >
          只看手动添加的联系人
        </Checkbox>
        <Divider
          type="horizontal"
          style={{ margin: '0', flex: 0 }}
        />
        <Checkbox
          name="contacts-table-filter-dropdown-only-business"
          checked={searchParams.isBusiness}
          onChange={onOnlyBusinessChange}
        >
          只看商业账号
        </Checkbox>
      </Flex>
      <Flex
        justify="end"
        gap={5}
      >
        <Button
          size="small"
          onClick={handleReset}
          type="primary"
        >
          重置
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={close}
        >
          确定
        </Button>
      </Flex>
    </StyledWrapper>
  );
};
