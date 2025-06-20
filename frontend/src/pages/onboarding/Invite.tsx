import { ActionItem } from '../../components/common/ActionItem';
import { Button } from '../../components/common/Button';
import { PageTitle } from '../../components/common/Title';


export const InviteOthers = () => {
  return (
    <div id="invite" className="screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <PageTitle description='Generate invitation codes to share with family members.'>Invite Others</PageTitle>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl border border-ui-border p-6">
            <h3 className="font-semibold text-text-primary mb-4">Generate new invitation</h3>
            <Button full variant='primary'>Generate Invitation Code</Button>
          </div>

          <div className="bg-white rounded-xl border border-ui-border p-6">
            <h3 className="font-semibold text-text-primary mb-4">Active invitations</h3>

            <div className="space-y-3">
              <ActionItem
                title="ABC123XY"
                subtitle="Expires in 6 days"
                actionText="Copy"
                onAction={() => { }}
              />

              <ActionItem
                title="DEF456UV"
                subtitle="Expires in 3 days"
                actionText="Copy"
                onAction={() => { }}
              />

            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button full variant='secondary'>Go to Dashboard</Button>
          <Button full variant="outline">Skip for now</Button>
        </div>
      </div>
    </div>
  );
};