import clsx from 'clsx';
import { throttle } from 'lodash-es';

import { useRef, useState } from 'react';

import { useIsomorphicLayoutEffect, useMemoizedFn } from 'ahooks';
import { Skeleton } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { TagsBarItem } from './item';
import { StyledSelects } from './styled';

export interface VariableOption {
  label: string;
  value: string;
}

export interface TagsBarProps {
  isLoading?: boolean;
  options?: VariableOption[];
  onInsert: (value: string) => void;
}

export const TagsBar = ({ isLoading = false, options = [], onInsert }: TagsBarProps) => {
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  const [shouldShowLeftArrow, setShouldShowLeftArrow] = useState(false);
  const [shouldShowRightArrow, setShouldShowRightArrow] = useState(false);

  const [shouldShowLeftScrollWidth, setShouldShowLeftScrollWidth] = useState(false);
  const [shouldShowRightScrollWidth, setShouldShowRightScrollWidth] = useState(false);

  const scrollTo = useMemoizedFn((scrollLeft: number) => {
    const selectWrapper = selectWrapperRef.current;
    if (selectWrapper) {
      selectWrapper.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  });

  const onClickLeftArrow = useMemoizedFn(() => {
    const selectWrapper = selectWrapperRef.current;

    if (selectWrapper) {
      const newScrollLeft = Math.max(0, selectWrapper.scrollLeft - 150);
      scrollTo(newScrollLeft);
    }
  });

  const onClickRightArrow = useMemoizedFn(() => {
    const selectWrapper = selectWrapperRef.current;

    if (selectWrapper) {
      const newScrollLeft = Math.min(
        selectWrapper.scrollWidth - selectWrapper.clientWidth,
        selectWrapper.scrollLeft + 150,
      );
      scrollTo(newScrollLeft);
    }
  });

  const onInsertTag = useMemoizedFn((value: string) => {
    onInsert(value);
    // 插入后显示轻微反馈动画效果
    const tag = document.querySelector(`[data-tag-value="${value}"]`);
    if (tag) {
      tag.classList.add('inserted');
      setTimeout(() => {
        tag.classList.remove('inserted');
      }, 500);
    }
  });

  const handleWheel = useMemoizedFn(
    throttle((e: WheelEvent) => {
      // 阻止滚轮事件冒泡，避免页面滚动
      e.preventDefault();
      e.stopPropagation();

      const selectWrapper = selectWrapperRef.current;
      if (!selectWrapper) return;

      // 计算新的滚动位置
      const scrollAmount = e.deltaX || e.deltaY;
      const newScrollLeft = Math.max(
        0,
        Math.min(selectWrapper.scrollLeft + scrollAmount, selectWrapper.scrollWidth - selectWrapper.clientWidth),
      );

      scrollTo(newScrollLeft);

      // 更新箭头和渐变显示状态
      updateArrowsVisibility(selectWrapper);
    }, 16), // 约60fps的节流率，以保证流畅滚动
  );

  const updateArrowsVisibility = (element: HTMLElement) => {
    const { scrollLeft, scrollWidth, clientWidth } = element;

    const showLeftArrow = scrollLeft > 5;
    const showRightArrow = scrollLeft < scrollWidth - clientWidth - 5;

    setShouldShowLeftArrow(showLeftArrow);
    setShouldShowLeftScrollWidth(showLeftArrow);

    setShouldShowRightArrow(showRightArrow);
    setShouldShowRightScrollWidth(showRightArrow);
  };

  useIsomorphicLayoutEffect(() => {
    const selectWrapper = selectWrapperRef.current;
    if (!selectWrapper) return;

    // 初始化箭头状态
    updateArrowsVisibility(selectWrapper);

    // 监听滚动结束事件
    const onScrollEnd = () => {
      updateArrowsVisibility(selectWrapper);
    };

    // 为事件委托做准备
    const handleWheelEvent = (e: WheelEvent) => {
      // 检查事件是否来自TagsBar或其子元素
      if (selectWrapper.contains(e.target as Node)) {
        handleWheel(e);
      }
    };

    // 处理触控板事件
    const handleTouchPad = (e: Event) => {
      updateArrowsVisibility(selectWrapper);
    };

    // 使用事件委托，在父元素上监听滚轮事件
    selectWrapper.addEventListener('wheel', handleWheelEvent, { passive: false });
    selectWrapper.addEventListener('scroll', throttle(handleTouchPad, 100), { passive: true });
    selectWrapper.addEventListener('scrollend', onScrollEnd, { passive: true });

    // 清理函数
    return () => {
      selectWrapper.removeEventListener('wheel', handleWheelEvent);
      selectWrapper.removeEventListener('scroll', handleTouchPad);
      selectWrapper.removeEventListener('scrollend', onScrollEnd);
    };
  }, [options, scrollTo, handleWheel]);

  if (isLoading) {
    return (
      <Skeleton
        active
        paragraph={{ rows: 1 }}
      />
    );
  }

  return (
    <StyledSelects
      className={clsx({
        'scroll-width-left': shouldShowLeftScrollWidth,
        'scroll-width-right': shouldShowRightScrollWidth,
      })}
    >
      {shouldShowLeftArrow && (
        <button
          type="button"
          className="arrow-button left"
          onClick={onClickLeftArrow}
          aria-label="向左滚动"
        >
          <ChevronLeft />
        </button>
      )}

      <section
        ref={selectWrapperRef}
        className="scrollable-list"
      >
        {options.map((item) => (
          <TagsBarItem
            key={item.value}
            onClick={() => onInsertTag(item.value)}
            data-tag-value={item.value}
            {...item}
          />
        ))}
      </section>

      {shouldShowRightArrow && (
        <button
          type="button"
          className="arrow-button right"
          onClick={onClickRightArrow}
          aria-label="向右滚动"
        >
          <ChevronRight />
        </button>
      )}
    </StyledSelects>
  );
};
