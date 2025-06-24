import { PageTitle, type PageTitleProps } from '../common/Title';

interface SectionTitleProps extends Omit<PageTitleProps, 'variant'> {}

export const SectionTitle = (props: SectionTitleProps) => {
  return <PageTitle {...props} variant="section" />;
};
