import { BookUp } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
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
          <Title variant="page" className="text-5xl md:text-7xl lg:text-8xl" textShadow> Welcome back{name}!</Title>
        </div>
        <Card className="w-fit" shadow="primary" padding="sm" variant="subtle">
          <p className="mb-0 text-lg md:text-2xl font-bold uppercase">Here's what's happening with your home maintenance. </p>
        </Card>
        {/** quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
          <StatCard size="md" className="" label="Total Manuals" value={47} subtitle="+3 This Month" variant="dark" rotation="left" />
          <StatCard size="md" className="" label="Pending Tasks" value={5} subtitle="2 Due Soon" variant="secondary" rotation="slight-right" />
          <StatCard size="md" className="" label="Completed" value={12} subtitle="This Month" variant="accent" rotation="slight-left" />
          <Card variant="primary" rotation="slight-right" shadow="secondary" padding="md">
            <div className="text-white font-bold text-lg uppercase mb-4">Quick Actions</div>
            <Button variant="tertiary" size="small" full className="mb-3 brutal-hover-press">
              + Add Manual
            </Button>
            <Button variant="primary" size="small" full className="!shadow-none !border-white">
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
              <Card variant="subtle" className="!border-error !border-l-8 md:!border-l-12" shadow="error" rotation="slight-left">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase text-text-primary mb-2">HVAC Filter Change</h3>
                    <p className="text-text-secondary font-bold uppercase text-xs md:text-sm">Kitchen Unit - 3rd Floor</p>
                  </div>
                  <span className="bg-error text-white px-3 md:px-4 py-1 md:py-2 font-bold uppercase text-xs border-4 border-text-primary self-start">
                    OVERDUE
                  </span>
                </div>
                <p className="text-text-primary font-bold mb-4 text-sm md:text-base">Replace air filter - last changed 4 months ago</p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button variant="secondary" size="small">
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="small">
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
              <Card variant="subtle" shadow="accent">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-accent border-4 border-text-primary flex items-center justify-center text-lg md:text-2xl font-black text-white brutal-rotate-slight-left">
                    <BookUp size={36}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-black uppercase text-text-primary mb-2">Manual Added</h3>
                    <p className="text-text-primary font-bold mb-2 text-sm md:text-base">Samsung Refrigerator RF28T5001SR</p>
                    <p className="text-text-secondary font-bold uppercase text-xs md:text-sm">Kitchen Appliances • 2 hours ago</p>
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