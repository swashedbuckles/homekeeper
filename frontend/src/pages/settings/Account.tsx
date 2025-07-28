import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
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
        <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 md:mb-8 text-text-primary">Personal Info</h2>
        <PersonalInfoForm name="Tom Joseph" email="tom@tomseph.dev" />
      </Card>
      <Card shadow="double">
        <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 md:mb-8 text-text-primary">Security</h2>
        <div className="space-y-4 md:space-y-6">
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase mb-3 md:mb-4 text-text-primary">Password</h3>
            <Text className="block">Last changed: March 15, 2025</Text>
            <Button full variant="secondary">Change Password</Button>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black uppercase mb-3 md:mb-4 text-text-primary">Two-Factor Auth</h3>
            <Text className="block">Status: Not Enabled</Text>
            <Button full variant="tertiary" disabled>Setup 2FA</Button>
          </div>
        </div>
      </Card>
    </Grid>
  );
};