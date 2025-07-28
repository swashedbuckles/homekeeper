import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { TextInput } from '../../components/form/TextInput';
import { Grid } from '../../components/layout/Grid';

export interface PersonalInfoFormProps {
  name: string;
  email: string;
}
export const PersonalInfoForm = ({ name, email }: PersonalInfoFormProps) => {
  return (
    <form className="space-y-4 md:space-y-6">
      <TextInput type="text" label="Display Name *" value={name} />
      <TextInput type="text" label="Email Address *" value={email} />
      <Button full variant="primary" size="xl">Update Profile</Button>
    </form>
  );
};

export const AccountSettings = () => {
  return (
    <Grid columns={2} spacing="lg">
      <Card shadow="double">
        <Title variant="section">Personal Info</Title>
        <PersonalInfoForm name="Tom Joseph" email="tom@tomseph.dev" />
      </Card>
      <Card shadow="double">
        <Title variant="section">Security</Title>
        <div className="space-y-4 md:space-y-6">
          <div>
            <Title variant="subsection">Password</Title>
            <Text className="block">Last changed: March 15, 2025</Text>
            <Button full variant="secondary">Change Password</Button>
          </div>
          <div>
            <Title variant="subsection">Two-Factor Auth</Title>
            <Text className="block">Status: Not Enabled</Text>
            <Button full variant="tertiary" disabled>Setup 2FA</Button>
          </div>
        </div>
      </Card>
    </Grid>
  );
};