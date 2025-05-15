import { PaginationProvider } from '@hooks/use-pagnation';

import { Operations } from './components/operations';
import { LogsDataProvider } from './providers/data';
import { FilterStateProvider } from './providers/filter-state';
import { SendLogsTable } from './table';

export interface SendLogViewProps {
  parentView?: HTMLElement | null;
}

export const SendLogView = ({ parentView }: SendLogViewProps) => {
  return (
    <PaginationProvider>
      <FilterStateProvider>
        <LogsDataProvider>
          <Operations parentViewRef={parentView} />
          <SendLogsTable parentViewRef={parentView} />
        </LogsDataProvider>
      </FilterStateProvider>
    </PaginationProvider>
  );
};
