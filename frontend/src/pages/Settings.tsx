import { Card } from '../components/common/Card';
import { Text } from '../components/common/Text';
import { Title } from '../components/common/Title';
import { WideContainer } from '../components/layout/containers/WideContainer';
import { Tabs } from '../components/layout/Tabs';
import { HouseholdSettings } from './settings/Household';

export interface SettingsProps { }

export const Settings = (_props: SettingsProps) => {
  return (
    <WideContainer>
      <div className="w-2/3 mt-8 mb-8">
        <Title variant="page" textShadow="orange">
          Settings & Household Management
        </Title>
        <Text variant="body" size="2xl" weight="bold" color="dark" uppercase>
          Manage your household and account settings.
        </Text>
      </div>
      <Tabs defaultTab="Household">
        <Tabs.List className="mb-6">
          <Tabs.Button size="lg" value="household">Household</Tabs.Button>
          <Tabs.Button size="lg" value="members">Members</Tabs.Button>
          <Tabs.Button size="lg" value="invites">Invites</Tabs.Button>
          <Tabs.Button size="lg" value="account">Account</Tabs.Button>
        </Tabs.List>
        <Tabs.Panel value="household" className="p-4">
          <HouseholdSettings />
        </Tabs.Panel>
        <Tabs.Panel value="members" className="p-4"><Card>members</Card></Tabs.Panel>
        <Tabs.Panel value="invites" className="p-4"><Card>invites</Card></Tabs.Panel>
        <Tabs.Panel value="account" className="p-4"><Card>account</Card></Tabs.Panel>
      </Tabs>
    </WideContainer>
  );
};
