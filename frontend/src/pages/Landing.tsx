import { Smartphone, LockKeyhole, Rocket, BookText, AlarmClock, Users } from 'lucide-react';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { DarkBgHeader } from '../components/common/Logo';
import { Text } from '../components/common/Text';
import { TextLink } from '../components/common/TextLink';
import { Title } from '../components/common/Title';
import { SectionContainer } from '../components/containers/SectionContainer';
import { StatCard } from '../components/variations/StatCard';

export const LandingPage = () => {
  return (
    <>
      <SectionContainer className="relative min-h-screen flex items-start">
        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Title variant="page" textShadow="orange" className="uppercase text-6xl md:text-8xl lg:text-9xl">
                Organize<br />
                Your<br />
                Home
              </Title>

              <Text variant="body" size="large" weight="bold" color="dark" uppercase className="block mb-12 leading-relaxed tracking-wide">
                Keep track of manuals,<br />
                schedules, and maintenance<br />
                for everything in your home.
              </Text>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="large" variant="primary">Get Started</Button>
                <Button size="large" variant="secondary">Learn More</Button>
              </div>
            </div>

            <div className="relative">
              <Card variant="default" shadow="dark" padding="lg">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-primary border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-left">
                    <BookText size={32}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Manual Storage</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Never lose another manual</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-secondary border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-right">
                    <AlarmClock size={32}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Smart Schedules</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Automated maintenance reminders</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-accent border-4 border-text-primary flex items-center justify-center text-2xl font-black text-white brutal-rotate-slight-left">
                    <Users size={32}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase text-text-primary">Family Sharing</h3>
                    <p className="text-text-secondary font-bold uppercase text-sm">Collaborate with household members</p>
                  </div>
                </div>
              </Card>

              <StatCard size="sm" className="absolute -top-16 -right-8 hidden lg:block" label="Manuals Stored" value={47} variant="primary" rotation="slight-right" />
              <StatCard size="sm" className="absolute -bottom-24 -left-16 hidden lg:block" label="Tasks Completed" value={12} variant="accent" rotation="left" />
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-text-primary border-t-8 border-primary" spacing="loose" hero>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
              <Smartphone size="42" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-4">Mobile Ready</h3>
            <p className="text-white font-bold uppercase text-sm">Access your home data anywhere, anytime.</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-secondary border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
              <LockKeyhole size="42" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-4">Secure Storage</h3>
            <p className="text-white font-bold uppercase text-sm">Your documents are encrypted and protected.</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-accent border-6 border-white flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">
              <Rocket size="42" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-4">Easy Setup</h3>
            <p className="text-white font-bold uppercase text-sm">Get organized in minutes, not hours.</p>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-primary" spacing="loose" hero>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-white uppercase mb-8 brutal-text-shadow-white">
            Ready to Get<br />Organized?
          </h2>
          <p className="text-2xl font-bold text-white uppercase mb-12">
            Join thousands of homeowners who've simplified their lives.
          </p>
          <Button variant="outline" size="large" className="bg-white uppercase">
            Start Free Today
          </Button>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-text-primary border-t-8 border-primary" hero>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <DarkBgHeader />

          <div className="flex gap-8">
            <TextLink href="#" variant="subtle" className="text-white hover:text-primary">Privacy</TextLink>
            <TextLink href="#" variant="subtle" className="text-white hover:text-primary">Terms</TextLink>
            <TextLink href="#" variant="subtle" className="text-white hover:text-primary">Support</TextLink>
          </div>
        </div>

        <div className="border-t border-white mt-8 pt-8 text-center">
          <Text variant="caption" size="small" weight="bold" color="white" uppercase>
            © 2025 HomeKeeper. All rights reserved.
          </Text>
        </div>
      </SectionContainer>
    </>
  );
};
