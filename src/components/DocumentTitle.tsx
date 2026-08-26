import { useEffect } from 'react';

interface DocumentTitleProps {
  title: string;
  suffix?: string;
}

export function DocumentTitle({ title, suffix = 'لومینو' }: DocumentTitleProps) {
  useEffect(() => {
    document.title = title ? `${title} | ${suffix}` : suffix;
  }, [title, suffix]);

  return null;
}
