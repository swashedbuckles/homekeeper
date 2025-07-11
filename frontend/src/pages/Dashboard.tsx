import { BookUp } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Code } from '../components/common/Code';
import { Text } from '../components/common/Text';
import { Title } from '../components/common/Title';
import { PageContainer } from '../components/containers/PageContainer';

import { StatCard } from '../components/variations/StatCard';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const navigate = useNavigate();
  const context = useAuth();
  const name = context.user?.name ? ` ${context.user?.name}` : '';
  
  const householdRoles = context.user?.householdRoles;

  useEffect(() => {
    const IS_DEV = !import.meta.env.PROD;
    if(!IS_DEV && (!householdRoles || Object.keys(householdRoles).length === 0)) {
      navigate('/onboarding');
    }
  }, [context, householdRoles, navigate]);


  return (
    <>
      <PageContainer>
        <div className="w-1/2">
          <Title variant="page" className="text-5xl md:text-7xl lg:text-8xl" textShadow="orange"> Welcome back{name}!</Title>
        </div>
        <Card className="w-fit" shadow="primary" padding="sm" variant="subtle">
          <Text variant="body" size="lg" weight="bold" uppercase className="mb-0">
            Here's what's happening with your home maintenance.
          </Text>
        </Card>
        {/** quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
          <StatCard size="md" className="" label="Total Manuals" value={47} subtitle="+3 This Month" variant="dark" rotation="left" shadow="double" hover hoverEffect="raise" />
          <StatCard size="md" className="" label="Pending Tasks" value={5} subtitle="2 Due Soon" variant="secondary" rotation="slight-right" shadow="double" hover hoverEffect="raise" />
          <StatCard size="md" className="" label="Completed" value={12} subtitle="This Month" variant="accent" rotation="slight-left" shadow="double" hover hoverEffect="raise" />
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
        </div>
        {/** activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
          <section>
            <Title variant="subsection" className="!text-primary text-3xl md:text-4xl lg:text-5xl brutal-text-shadow-simple mb-6 md:mb-8"> 
                Upcoming <br/>
                Maintenance
            </Title>
            <div className="space-y-6">
              <Card variant="default" className="!border-error !border-l-8 md:!border-l-12" shadow="error" rotation="slight-left">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
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
                </div>
                <Text variant="body" size="md" weight="bold" color="dark" className="block mb-4">
                  Replace air filter - last changed 4 months ago
                </Text>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button variant="secondary" size="sm">
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </Card>
            </div>
          </section>
          <section>
            <Title variant="subsection" className="!text-primary text-3xl md:text-4xl lg:text-5xl brutal-text-shadow-simple mb-6 md:mb-8"> 
                Recent <br/>
                Activity
            </Title>
            <div className="space-y-6">
              <Card variant="default" shadow="accent">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-accent border-4 border-text-primary flex items-center justify-center text-lg md:text-2xl font-black text-white brutal-rotate-slight-left">
                    <BookUp size={36}/>
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
                </div>
              </Card>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}