import { memo, useMemo } from 'react';

import { Radio } from 'antd';

import { FILTER_SUCCESS_OPTIONS, useFilterState } from '../providers/filter-state';

export const FilterCheckbox = memo(() => {
  const { filterSuccess, setFilterSuccess } = useFilterState();

  const options = useMemo(
    () => [
      {
        label: '全部',
        value: FILTER_SUCCESS_OPTIONS.ALL,
      },
      {
        label: '成功',
        value: FILTER_SUCCESS_OPTIONS.SUCCESS,
      },
      {
        label: '失败',
        value: FILTER_SUCCESS_OPTIONS.FAILED,
      },
    ],
    [],
  );

  return (
    <Radio.Group
      options={options}
      defaultValue="Apple"
      optionType="button"
      buttonStyle="solid"
      value={filterSuccess}
      onChange={(e) => setFilterSuccess(e.target.value)}
    />
  );
});
