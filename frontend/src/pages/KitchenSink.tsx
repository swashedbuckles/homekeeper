import { useState } from 'react';
import { BackgroundRectangles } from '../components/BackgroundRectangles';

// Common Components
import { ActionItem } from '../components/common/ActionItem';
import { Alert } from '../components/common/Alert';
import { BackButton } from '../components/common/BackButton';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Title } from '../components/common/Title';

// Form Components
import { ContentContainer } from '../components/containers/ContentContainer';
import { PasswordStrengthIndicator } from '../components/form/PasswordStrengthIndicator';
import { TextArea } from '../components/form/TextArea';
import { TextInput } from '../components/form/TextInput';

// Variation Components
import { CodeInput } from '../components/variations/CodeInput';
import { OptionCard } from '../components/variations/OptionCard';
import { SectionTitle } from '../components/variations/SectionTitle';
import { StatCard } from '../components/variations/StatCard';
import { SubSectionTitle } from '../components/variations/SubSectionTitle';
import { TaskCard } from '../components/variations/TaskCard';

// Container Components

/**
 * KitchenSink Page - Comprehensive display of all base and variation components.
 * 
 * Used for testing, development, and design verification. Shows all component
 * variants, sizes, and states in one location.
 */
export function KitchenSink() {
  const [password, setPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundRectangles />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <ContentContainer className="py-10">
        <Title variant="page" textShadow className="mb-12">
          Component Kitchen Sink
        </Title>

        {/* Buttons Section */}
        <SectionTitle className="mb-8">Buttons</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <SubSectionTitle className="mb-6">Button Variants</SubSectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger">Danger</Button>
          </div>

          <SubSectionTitle className="mb-6">Button Sizes</SubSectionTitle>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="default">Default</Button>
            <Button variant="primary" size="large">Large</Button>
          </div>

          <SubSectionTitle className="mb-6">Button States</SubSectionTitle>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" full>Full Width</Button>
          </div>

          <SubSectionTitle className="mb-6">Back Button</SubSectionTitle>
          <div className="flex gap-4">
            <BackButton />
            <BackButton label="Custom Label" size="small" />
            <BackButton variant="text" label="Text Style" />
          </div>
        </Card>

        {/* Cards Section */}
        <SectionTitle className="mb-8">Cards</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Card Variants</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card variant="default" className="p-4">
              <p className="font-mono">Default Card</p>
            </Card>
            <Card variant="subtle" className="p-4">
              <p className="font-mono">Subtle Card</p>
            </Card>
            <Card variant="primary" className="p-4">
              <p className="font-mono text-white">Primary Card</p>
            </Card>
            <Card variant="secondary" className="p-4">
              <p className="font-mono text-white">Secondary Card</p>
            </Card>
            <Card variant="accent" className="p-4">
              <p className="font-mono text-white">Accent Card</p>
            </Card>
            <Card variant="danger" className="p-4">
              <p className="font-mono text-white">Danger Card</p>
            </Card>
          </div>

          <SubSectionTitle className="mb-6">Card Shadows & Rotations</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" shadow="primary" rotation="slight-left" className="p-4">
              <p className="font-mono">Primary Shadow + Rotation</p>
            </Card>
            <Card variant="default" shadow="triple" rotation="slight-right" className="p-4">
              <p className="font-mono">Triple Shadow + Rotation</p>
            </Card>
            <Card variant="default" shadow="mega" className="p-4">
              <p className="font-mono">Mega Shadow</p>
            </Card>
            <Card variant="default" shadow="none" className="p-4">
              <p className="font-mono">No Shadow</p>
            </Card>
          </div>
        </Card>

        {/* Typography Section */}
        <SectionTitle className="mb-8">Typography</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <Title variant="page" className="mb-4">Page Title</Title>
          <Title variant="section" className="mb-4">Section Title</Title>
          <Title variant="subsection" className="mb-6">Subsection Title</Title>
          
          <SectionTitle textShadow className="mb-4">Section Title with Shadow</SectionTitle>
          <SubSectionTitle rotation="slight-left" className="mb-6">Rotated Subsection</SubSectionTitle>
          
          <p className="font-mono text-text-primary">Regular monospace text</p>
          <p className="font-mono font-bold uppercase text-text-secondary">Bold uppercase text</p>
        </Card>

        {/* Form Components Section */}
        <SectionTitle className="mb-8">Form Components</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SubSectionTitle className="mb-6">Text Input</SubSectionTitle>
              <TextInput 
                label="Email Address" 
                type="email" 
                placeholder="Enter your email"
                className="mb-4"
              />
              <TextInput 
                label="Password" 
                type="password" 
                size="large"
                placeholder="Enter password"
                className="mb-4"
              />
              <TextInput 
                label="Error State" 
                type="text" 
                error="This field is required"
                className=""
              />

              <SubSectionTitle className="mb-4">Code Input</SubSectionTitle>
              <CodeInput 
                label="Invitation Code"
                placeholder="ABC123"
                maxLength={6}
                className="mb-4"
              />
              <CodeInput 
                label="Verification Code"
                size="large"
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <div>
              <SubSectionTitle className="mb-6">Text Area</SubSectionTitle>
              <TextArea 
                label="Description"
                placeholder="Tell us about your household..."
                rows={4}
                className="mb-4"
              />
              <TextArea 
                label="Large Text Area"
                size="large"
                placeholder="Larger text area example"
                rows={6}
                className="mb-4"
              />

              <SubSectionTitle className="mb-4">Password Strength</SubSectionTitle>
              <TextInput 
                label="Test Password" 
                type="password" 
                placeholder="Type to see strength"
                value={password}
                register={{
                  onChange: (e) => setPassword(e.target.value),
                  name: 'password'
                }}
              />
              <PasswordStrengthIndicator password={password} />
            </div>
          </div>
        </Card>

        {/* Alert Section */}
        <SectionTitle className="mb-8">Alerts</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <div className="space-y-4">
            <Alert variant="info">This is an informational message.</Alert>
            <Alert variant="success">Operation completed successfully!</Alert>
            <Alert variant="warning">Please review the following items.</Alert>
            <Alert variant="error">An error occurred while processing.</Alert>
            <Alert variant="basic" hideIcon>Basic alert without icon.</Alert>
          </div>

          <SubSectionTitle className="mt-8 mb-4">Alert Sizes</SubSectionTitle>
          <div className="space-y-4">
            <Alert variant="info" size="small">Small alert message</Alert>
            <Alert variant="warning" size="default">Default size alert</Alert>
            <Alert variant="error" size="large">Large alert with more prominent styling</Alert>
          </div>
        </Card>

        {/* Variation Components Section */}
        <SectionTitle className="mb-8">Variation Components</SectionTitle>
        
        {/* Option Cards */}
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Option Cards</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <OptionCard
              title="Create New Household"
              description="Start fresh and invite family members"
              icon="🏠"
              selected={selectedOption === 'create'}
              onClick={() => setSelectedOption('create')}
            />
            <OptionCard
              title="Join Existing Household"
              description="Use an invitation code to join"
              icon="🔑"
              buttonText="Join with Code"
              onButtonClick={() => alert('Join clicked')}
            />
          </div>

          <SubSectionTitle className="mb-6">Stat Cards</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Active Tasks"
              value="12"
              variant="primary"
              rotation="slight-left"
            />
            <StatCard
              label="Completed"
              value="45"
              variant="accent"
              rotation="slight-right"
            />
            <StatCard
              label="Overdue"
              value="3"
              variant="secondary"
            />
          </div>

          <SubSectionTitle className="mb-6">Task Cards</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskCard
              title="Clean Kitchen"
              subtitle="Deep clean counters and appliances"
              status="urgent"
              dueDate="Due Tomorrow"
              onAction={() => alert('Task action clicked')}
              actionLabel="Mark Done"
            />
            <TaskCard
              title="Grocery Shopping"
              subtitle="Weekly grocery run"
              status="completed"
              dueDate="Completed Yesterday"
            />
            <TaskCard
              title="Pool Maintenance"
              subtitle="Check chemicals and clean filter"
              status="normal"
              dueDate="Due in 3 Days"
              onAction={() => alert('View details clicked')}
              actionLabel="View Details"
            />
            <TaskCard
              title="Garden Watering"
              subtitle="Water plants and check sprinkler system"
              status="future"
              dueDate="Due Next Week"
            />
          </div>
        </Card>

        {/* Action Items Section */}
        <SectionTitle className="mb-8">Action Items</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <div className="space-y-4">
            <ActionItem
              title="Review House Rules"
              subtitle="Last updated 2 days ago"
              actions={<Button variant="primary" size="small">Edit</Button>}
            />
            <ActionItem
              title="Complete Monthly Budget"
              subtitle="Due in 3 days"
              status="urgent"
              actions={<Button variant="danger" size="small">Complete Now</Button>}
            />
            <ActionItem
              title="Schedule Maintenance"
              subtitle="HVAC check completed"
              status="completed"
              actions={<Button variant="outline" size="small">View Details</Button>}
            />
            <ActionItem
              title="Update Emergency Contacts"
              subtitle="Requires attention"
              status="info"
              hover
              onClick={() => alert('Action item clicked')}
            />
          </div>
        </Card>

        {/* Footer */}
        <Card variant="dark" shadow="mega" className="p-8">
          <Title variant="section" className="mb-4 text-white">
            Kitchen Sink Complete
          </Title>
          <p className="font-mono text-white">
            All base and variation components displayed above. Use this page for
            design verification, testing, and component development.
          </p>
        </Card>
        </ContentContainer>
      </div>
    </div>
  );
}