import { Alert } from '../../components/common/Alert';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Code } from '../../components/common/Code';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { Select, Option } from '../../components/form/Select';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';
import { Grid } from '../../components/layout/Grid';
import type { HouseholdRoles } from '@homekeeper/shared';

export const SendNewInviteForm = () => {
  return (
    <form className="space-y-4 md:space-y-6">
      <TextInput type="text" label="Email Address *" placeholder="Enter Email Address" />
      <Select label="Initial Role *">
        <Option value="member">Member - Can Edit</Option>
        <Option value="guest">Guest - View Only</Option>
        <Option value="admin">Admin - Full Access</Option>
      </Select>
      <TextArea label="Personal Message (Optional)" placeholder="Hey! Join our household to help manage our home..." />
      <Button type="submit" full variant="primary">Send Invitation</Button>
    </form>
  );
};

export interface InviteListItemProps {
  email: string;
  code: string;
  role: 'admin' | 'owner' | 'member' | 'guest';
  expirationDays: number;
  rotation?: 'none' | 'left' | 'right' | 'slight-left' | 'slight-right';
}
type variant_t = 'default' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'danger' | 'dark';
export const InviteListItem = ({email, code, role, rotation, expirationDays}: InviteListItemProps) => {
  const VARIANTS_BY_ROLE: Record<HouseholdRoles, variant_t> = {
    owner: 'primary',
    admin: 'dark',
    member: 'secondary', 
    guest: 'accent'
  };

  const cardVariant = VARIANTS_BY_ROLE[role];

  return (
    <Card variant={cardVariant} rotation={rotation}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-black text-white uppercase text-sm md:text-lg">{email}</h3>
          <p className="text-white font-bold uppercase text-xs md:text-sm mt-2">
            Code: <Code size="xs">{code}</Code>
          </p>
          <p className="text-white font-bold uppercase text-xs md:text-sm mt-1">
            Role: {role} • Expires in {expirationDays} days
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <Button variant="accent">Copy Code</Button>
          <Button variant="danger">Cancel</Button>
        </div>
      </div>
    </Card>
  );
};

export const InvitesSettings = () => {
  return (
    <Grid columns={2} spacing="lg">
      <Card shadow="double">
        <Title variant="section">Send New Invite</Title>
        <SendNewInviteForm />
      </Card>
      <Card shadow="double">
        <Title variant="section">Pending Invitations</Title>
        <div className="space-y-8">
          <InviteListItem email="emma@example.com" role="member" expirationDays={4} code="XYZ789AB" rotation="slight-left"/>
          <InviteListItem email="tom@example.com" role="guest" expirationDays={6} code="QRS456CD" rotation="slight-right"/>
        </div>
        <Alert className="mt-4 md:mt-6 p-3 md:p-4" variant="warning">
          <Text className="text-white">Invitation codes expire after 7 days. Resend if needed.</Text>
        </Alert>
      </Card>
    </Grid>
  );
};