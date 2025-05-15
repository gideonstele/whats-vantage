import { memo } from 'react';

import { Flex } from 'antd';

import { ClearAllButton } from './clear-all-button';
import { ExportButton } from './export-button';
import { FilterCheckbox } from './filter-checkbox';

export const Operations = memo(({ parentViewRef }: { parentViewRef?: HTMLElement | null }) => {
  return (
    <Flex
      justify="space-between"
      gap={8}
    >
      <Flex
        justify="flex-start"
        gap={8}
        flex={1}
      >
        <FilterCheckbox />
      </Flex>
      <Flex
        justify="flex-end"
        gap={8}
        flex={1}
      >
        <ClearAllButton />
        <ExportButton parentViewRef={parentViewRef} />
      </Flex>
    </Flex>
  );
});
