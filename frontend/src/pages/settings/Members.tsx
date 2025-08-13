import { HOUSEHOLD_ROLE, type HouseholdRoles } from '@homekeeper/shared';
import { useState, useEffect } from 'react';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ListItem } from '../../components/common/ListItem';
import { Option, Select } from '../../components/form/Select';

import { useAuth } from '../../hooks/useAuth';
import { useConfirmation } from '../../hooks/useConfirmation';
import { useHousehold } from '../../hooks/useHousehold';
import { useMembers } from '../../hooks/useMembers';
import { setMemberRole, removeMember } from '../../lib/api/household';

export interface MemberListItemProps {
  id: string;
  name:  string;
  email: string;
  role:  HouseholdRoles;
  householdId: string;

  canRemove: boolean;
  canUpdate: boolean;
}

export const MemberListItem = ({id, name, email, role: currentRole, householdId, canUpdate, canRemove}: MemberListItemProps) => {
  const [selectedRole, setSelectedRole] = useState<HouseholdRoles>(currentRole);
  const [isUpdating, setIsUpdating]     = useState(false);
  const confirm = useConfirmation();
  
  // Sync local state when currentRole changes (after successful API update)
  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);
  
  const hasRoleChanged = selectedRole !== currentRole;
  
  const handleCancel = () => setSelectedRole(currentRole);
  const handleRoleSelect = (newRole: string) => setSelectedRole(newRole as HouseholdRoles);

  const handleUpdate = async () => {
    if (!canUpdate || !hasRoleChanged) return;
    
    setIsUpdating(true);
    try {
      await setMemberRole(householdId, id, selectedRole);
    } catch (error) {
      console.error('Failed to update member role:', error);
      // Reset to original role on error
      setSelectedRole(currentRole);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!canRemove) return;
    
    const result = await confirm({
      title: 'Remove Member',
      message: `Are you sure you want to remove ${name} from this household? This action cannot be undone.`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    
    if (result) {
      try {
        await removeMember(householdId, id);
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  return (
    <ListItem title={name} subtitle={email}>
      <ListItem.Avatar color="secondary">{name.charAt(0)}</ListItem.Avatar>
      <ListItem.Content>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex-shrink-0">
            <Select size="sm" label="" grouped value={selectedRole} onChange={handleRoleSelect} disabled={!canUpdate}>
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
              <Option value="guest">Guest</Option>
            </Select>
          </div>
          <div className="flex gap-2">
            {canUpdate && hasRoleChanged && (
              <>
                <Button size="sm" variant="secondary" onClick={handleCancel} disabled={isUpdating}>Cancel</Button>
                <Button size="sm" variant="primary" onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </>
            )}
            {canRemove && (
              <Button size="sm" variant="danger" onClick={handleRemove}>Remove</Button>
            )}
          </div>
        </div>
      </ListItem.Content>
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
  const members = (memberData?.data?.members ?? []).filter(member => member.id !== user.id);

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
              id={member.id}
              name={member.name} 
              email={member.email} 
              role={member.role}
              householdId={activeHouseholdId} 
              canRemove={canRemove}
              canUpdate={canUpdate}
              key={member.id}
            />
          ))
        }
      </div>
    </Card>
  );
};
