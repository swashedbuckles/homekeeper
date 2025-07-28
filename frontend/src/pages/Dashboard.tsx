import { BookUp } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Code } from '../components/common/Code';
import { Text } from '../components/common/Text';
import { Title } from '../components/common/Title';
import { WideContainer } from '../components/layout/containers/WideContainer';
import { Flex, Stack, Inline } from '../components/layout/Flex';
import { Grid } from '../components/layout/Grid';

import { StatCard } from '../components/variations/StatCard';
import { useAuth } from '../hooks/useAuth';
import { getResponsiveTextToken, getResponsivePattern } from '../lib/design-system/sizes';

export function Dashboard() {
  const navigate = useNavigate();
  const context = useAuth();
  const name = context.user?.name ? ` ${context.user?.name}` : '';

  const householdRoles = context.user?.householdRoles;

  useEffect(() => {
    const IS_DEV = !import.meta.env.PROD;
    if (!IS_DEV && (!householdRoles || Object.keys(householdRoles).length === 0)) {
      navigate('/onboarding');
    }
  }, [context, householdRoles, navigate]);


  return (
    <WideContainer>
      <div className="w-1/2">
        <Title variant="hero" textShadow="orange"> Welcome back{name}!</Title>
      </div>
      <Card className="w-fit" shadow="primary" padding="sm" variant="subtle">
        <Text variant="body" size="lg" weight="bold" uppercase className="mb-0">
          Here's what's happening with your home maintenance.
        </Text>
      </Card>
      {/** quick stats */}
      <Grid columns={4} spacing="xl" className="mt-8">
        <StatCard size="md" className="" label="Total Manuals" value={47} subtitle="+3 This Month" variant="dark" rotation="left" shadow="double" hover hoverEffect="lift" />
        <StatCard size="md" className="" label="Pending Tasks" value={5} subtitle="2 Due Soon" variant="secondary" rotation="slight-right" shadow="double" hover hoverEffect="lift" />
        <StatCard size="md" className="" label="Completed" value={12} subtitle="This Month" variant="accent" rotation="slight-left" shadow="double" hover hoverEffect="lift" />
        <Card variant="primary" rotation="slight-right" shadow="secondary" padding="md">
          <Text variant="body" size="lg" weight="bold" color="white" uppercase className="block mb-4">
            Quick Actions
          </Text>
          <Button variant="tertiary" size="sm" full className="mb-3 brutal-hover-press">
            + Add Manual
          </Button>
          <Button variant="primary" size="sm" full className="!shadow-none !border-white">
            + Schedule Task
          </Button>
        </Card>
      </Grid>
      {/** activity */}
      <Grid columns={2} spacing="xl" className="mt-12">
        <section>
          <Title variant="subsection" className={`!text-primary ${getResponsiveTextToken('xl')} brutal-text-shadow-simple mb-6`}>
            Upcoming <br />
            Maintenance
          </Title>
          <Stack spacing="lg">
            <Card variant="default" className="!border-error !border-l-8 md:!border-l-12" shadow="error" rotation="slight-left">
              <Flex spacing="sm" className={`${getResponsivePattern('stackToRow')} md:justify-between md:items-start mb-4`}>
                <div>
                  <Text variant="body" size="lg" weight="black" color="dark" uppercase className="block mb-2">
                    HVAC Filter Change
                  </Text>
                  <Text variant="caption" size="sm" weight="bold" color="secondary" uppercase>
                    Kitchen Unit - 3rd Floor
                  </Text>
                </div>
                <Badge variant="status" color="error" size="sm">
                  OVERDUE
                </Badge>
              </Flex>
              <Text variant="body" size="md" weight="bold" color="dark" className="block mb-4">
                Replace air filter - last changed 4 months ago
              </Text>
              <Inline spacing="md" className={getResponsivePattern('stackToRow')}>
                <Button variant="secondary" size="sm">
                  Mark Complete
                </Button>
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
              </Inline>
            </Card>
          </Stack>
        </section>
        <section>
          <Title variant="subsection" className={`!text-primary ${getResponsiveTextToken('xl')} brutal-text-shadow-simple mb-6`}>
            Recent <br />
            Activity
          </Title>
          <Stack spacing="lg">
            <Card variant="default" shadow="accent">
              <Flex spacing="sm" className="items-start">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-accent border-4 border-text-primary flex items-center justify-center ${getResponsiveTextToken('lg')} font-black text-white brutal-rotate-slight-left`}>
                  <BookUp size={36} />
                </div>
                <div className="flex-1">
                  <Text variant="body" size="md" weight="black" color="dark" uppercase className="block mb-2">
                    Manual Added
                  </Text>
                  <Text variant="body" size="md" weight="bold" color="dark" className="block mb-2">
                    Samsung Refrigerator <Code>RF28T5001SR</Code>
                  </Text>
                  <Text variant="caption" size="sm" weight="bold" color="secondary" uppercase>
                    Kitchen Appliances • 2 hours ago
                  </Text>
                </div>
              </Flex>
            </Card>
          </Stack>
        </section>
      </Grid>
    </WideContainer>
  );
}