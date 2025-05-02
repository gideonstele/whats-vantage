import { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import useEvent from 'react-use-event-hook';

import { Button, Result } from 'antd';

export interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackRender?: (props: FallbackProps) => ReactNode;
}

const DefaultFallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Result
      status="error"
      title={error.message}
      subTitle={<pre>{error.stack}</pre>}
      extra={<Button onClick={resetErrorBoundary}>Try again</Button>}
    />
  );
};

export const ErrorBoundary = ({ children, FallbackRender = DefaultFallbackRender }: ErrorBoundaryProps) => {
  const onError = useEvent((error: Error, info: ErrorInfo) => {
    console.error('ErrorBoundary', error, info);
  });

  return (
    <ReactErrorBoundary
      onError={onError}
      fallbackRender={FallbackRender}
    >
      {children}
    </ReactErrorBoundary>
  );
};
