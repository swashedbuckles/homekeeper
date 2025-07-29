import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ListItem } from '../../components/common/ListItem';
import { Option, Select } from '../../components/form/Select';

export const MembersSettings = () => {
  return (
    <Card shadow="double">
      <div className="space-y-4 md:space-y-6">
        <ListItem title="Alison Smith" subtitle="alison@example.com" variant="primary">
          <ListItem.Avatar color="dark">A</ListItem.Avatar>
          <ListItem.Badge>owner</ListItem.Badge>
          <ListItem.Content>
            <div className="font-bold uppercase text-xs md:text-sm text-center sm:text-right">
              You cannot modify your own role
            </div>
          </ListItem.Content>
        </ListItem>
        <ListItem title="John Smith" subtitle="john@example.com">
          <ListItem.Avatar color="secondary">J</ListItem.Avatar>
          <ListItem.Content>
            <Select size="sm" label="" grouped>
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
              <Option value="guest">Guest</Option>
            </Select>
          </ListItem.Content>
          <ListItem.Actions>
            <Button size="sm" variant="secondary">Update</Button>
            <Button size="sm" variant="danger">Remove</Button>
          </ListItem.Actions>
        </ListItem>
        <ListItem title="Sarah Smith" subtitle="sarah@example.com">
          <ListItem.Avatar color="accent">S</ListItem.Avatar>
          <ListItem.Content>
            <Select label="" grouped size="sm">
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
              <Option value="guest">Guest</Option>
            </Select>
          </ListItem.Content>
          <ListItem.Actions>
            <Button size="sm" variant="secondary">Update</Button>
            <Button size="sm" variant="danger">Remove</Button>
          </ListItem.Actions>
        </ListItem>
      </div>
    </Card>
  );
};
