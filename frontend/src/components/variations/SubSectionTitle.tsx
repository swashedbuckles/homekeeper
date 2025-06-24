import { PageTitle, type PageTitleProps } from '../common/Title';

interface SubsectionTitleProps extends Omit<PageTitleProps, 'variant'> {}

export const SubsectionTitle = (props: SubsectionTitleProps) => {
  return <PageTitle {...props} variant="subsection" />;
};