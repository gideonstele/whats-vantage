import dayjs from 'dayjs';

import { memo, useMemo } from 'react';

import styled from '@emotion/styled';

const StyledWrapper = styled.section({
  display: 'inline-flex',
  flexDirection: 'column',
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
});

interface RenderItemDisplayTimeProps {
  value: string | number;
}

export const RenderItemDisplayTime = memo(({ value }: RenderItemDisplayTimeProps) => {
  const [date, time] = useMemo(() => {
    const dayjsobj = dayjs(value);
    const isToday = dayjsobj.isSame(dayjs(), 'day') ? '今天' : '';
    const isYesterday = dayjsobj.isSame(dayjs().subtract(1, 'day'), 'day') ? '昨天' : '';

    const isTodayOrYesterday = isToday || isYesterday;

    const date = `${dayjsobj.format('YYYY-MM-DD')}${isTodayOrYesterday ? '(' + isTodayOrYesterday + ')' : ''}`;
    const time = dayjsobj.format('HH:mm:ss');

    return [date, time];
  }, [value]);

  return (
    <StyledWrapper>
      <section>{time}</section>
      <section>{date}</section>
    </StyledWrapper>
  );
});
