import { HOUSEHOLD_ROLE, type HouseholdRoles } from '@homekeeper/shared';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ListItem } from '../../components/common/ListItem';
import { Option, Select } from '../../components/form/Select';

import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';
import { useMembers } from '../../hooks/useMembers';

import type { AllowedActionChildren } from '../../lib/validation/children';

export interface MemberListItemProps {
  name:  string;
  email: string;
  role:  HouseholdRoles;

  canRemove: boolean;
  canUpdate: boolean;
}

export const MemberListItem = ({name, email, role: currentRole, canUpdate, canRemove}: MemberListItemProps) => {
  const actions: AllowedActionChildren = [];
  if(canUpdate) {
    actions.push(<Button size="sm" variant="secondary">Update</Button>);
  }

  if(canRemove) {
    actions.push(<Button size="sm" variant="danger">Remove</Button>);
  }

  return (
    <ListItem title={name} subtitle={email}>
      <ListItem.Avatar color="secondary">{name.charAt(0)}</ListItem.Avatar>
      <ListItem.Content>
        <Select size="sm" label="" grouped value={currentRole}>
          <Option value="admin">Admin</Option>
          <Option value="member">Member</Option>
          <Option value="guest">Guest</Option>
        </Select>
      </ListItem.Content>
      <ListItem.Actions>
        {...actions}
      </ListItem.Actions>
    </ListItem>
  );
};

export const MembersSettings = () => {
  const { user } = useAuth();
  const { activeHouseholdId } = useHousehold();
  const { data: memberData } = useMembers(activeHouseholdId || '');

  if (!activeHouseholdId || !user) {
    return null;
  }

  const role = user.householdRoles[activeHouseholdId];
  const members = memberData?.data?.members ?? [];

  const canRemove = role === HOUSEHOLD_ROLE.OWNER;
  const canUpdate = role === HOUSEHOLD_ROLE.OWNER || role === HOUSEHOLD_ROLE.ADMIN;

  return (
    <Card shadow="double">
      <div className="space-y-4 md:space-y-6">
        <ListItem title={user.name} subtitle={user.email} variant="primary">
          <ListItem.Avatar color="dark">{user.name.charAt(0)}</ListItem.Avatar>
          <ListItem.Badge>{role}</ListItem.Badge>
          <ListItem.Content>
            <div className="font-bold uppercase text-xs md:text-sm text-center sm:text-right">
              You cannot modify your own role
            </div>
          </ListItem.Content>
        </ListItem>
        {
          members.map(member => (
            <MemberListItem 
              name={member.name} 
              email={member.name} 
              role={member.role} 
              canRemove={canRemove}
              canUpdate={canUpdate}
              key={member.name}
            />
          ))
        }
      </div>
    </Card>
  );
};
