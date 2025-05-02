import { isEqual as lodashIsEqual, isFunction } from 'lodash-es';

import { useSyncExternalStore } from 'react';

type ListenFn<S> = (value: S) => void;
type InitializeFn<S> = () => S | Promise<S>;
type UpdateFn<S> = (draft: S) => S;
type UseFn<S> = () => S;

class ReactExternalStore<S> {
  listeners: ListenFn<S>[];
  isInitialized: boolean = false;
  currentValue: S;
  initializeFn?: InitializeFn<S>;
  isEqual: (a: S, b: S) => boolean;
  constructor(defaultValue: S, initializeFn?: InitializeFn<S>, isEqual: (a: S, b: S) => boolean = lodashIsEqual) {
    this.listeners = [];
    this.currentValue = defaultValue;
    this.initializeFn = initializeFn;
    this.isEqual = isEqual;
    this.initialize();
  }
  private initialize = async () => {
    if (this.initializeFn && !this.isInitialized) {
      const value = await this.initializeFn();

      if (value !== undefined) {
        this.update(value);
      }

      this.isInitialized = true;
    }
  };
  subscribe = (listener: ListenFn<S>) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  };
  getSnapshot = () => {
    return this.currentValue;
  };
  update = (value: S | UpdateFn<S>) => {
    const nextValue = isFunction(value) ? value(this.currentValue) : value;
    if (this.isEqual(this.currentValue, nextValue)) {
      return;
    }

    this.currentValue = nextValue;
    this.listeners.forEach((fn) => {
      fn(nextValue);
    });
  };
}

const useExternalStore = <S>(store: ReactExternalStore<S>) => {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
};

export const createExternalState = <S>(
  initialValue: S,
  initializeFn?: InitializeFn<S>,
  isEqual?: (a: S, b: S) => boolean,
): [ReactExternalStore<S>, UseFn<S>] => {
  const store = new ReactExternalStore(initialValue, initializeFn, isEqual);
  const useExternalState = () => useExternalStore(store);

  return [store, useExternalState] as const;
};
