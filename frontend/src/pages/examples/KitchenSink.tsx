import { Home, Key } from 'lucide-react';
import { useState } from 'react';
import { BackgroundCircles } from '../../components/backgrounds/BackgroundCircles';
import { BackgroundGrid } from '../../components/backgrounds/BackgroundGrid';
import { BackgroundLines } from '../../components/backgrounds/BackgroundLines';
import { BackgroundRectangles } from '../../components/backgrounds/BackgroundRectangles';

// Common Components
import { BackgroundSquares } from '../../components/backgrounds/BackgroundSquares';
import { Alert } from '../../components/common/Alert';
import { BackButton } from '../../components/common/BackButton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Code } from '../../components/common/Code';
import { ListItem } from '../../components/common/ListItem';
import { Stats } from '../../components/common/Stats';
import { Text } from '../../components/common/Text';
import { TextLink } from '../../components/common/TextLink';
import { Title } from '../../components/common/Title';

// Form Components
import { PasswordStrengthIndicator } from '../../components/form/PasswordStrengthIndicator';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';
import { ContentContainer } from '../../components/layout/containers/ContentContainer';

// Variation Components
import { CodeInput } from '../../components/variations/CodeInput';
import { OptionCard } from '../../components/variations/OptionCard';
import { SectionTitle } from '../../components/variations/SectionTitle';
import { StatCard } from '../../components/variations/StatCard';
import { SubSectionTitle } from '../../components/variations/SubSectionTitle';
import { TaskCard } from '../../components/variations/TaskCard';

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
        <Title variant="page" textShadow="orange" className="mb-12">
          Component Kitchen Sink
        </Title>


        {/* Buttons Section */}
        <SectionTitle className="mb-8">Buttons</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <SubSectionTitle className="mb-6">Button Variants</SubSectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="accent">Accent</Button>
          </div>

          <SubSectionTitle className="mb-6">Button Sizes</SubSectionTitle>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="default" shadow="primary" rotation="slight-left" className="p-4">
              <p className="font-mono">Primary Shadow + Rotation</p>
            </Card>
            <Card variant="default" shadow="double" rotation="slight-right" className="p-4">
              <p className="font-mono">Double Shadow + Rotation</p>
            </Card>
            <Card variant="default" shadow="triple" className="p-4">
              <p className="font-mono">Triple Shadow</p>
            </Card>
            <Card variant="default" shadow="none" className="p-4">
              <p className="font-mono">No Shadow</p>
            </Card>
          </div>

          <SubSectionTitle className="mb-6">Card Hover Effects</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="default" hover hoverEffect="lift" className="p-4">
              <p className="font-mono">Hover: Lift (Default)</p>
            </Card>
            <Card variant="primary" hover hoverEffect="raise" shadow="double" className="p-4">
              <p className="font-mono text-white">Hover: Raise (3-Shadow)</p>
            </Card>
            <Card variant="secondary" hover hoverEffect="press" className="p-4">
              <p className="font-mono text-white">Hover: Press</p>
            </Card>
            <Card variant="accent" hover hoverEffect="press-small" className="p-4">
              <p className="font-mono text-white">Hover: Press Small</p>
            </Card>
          </div>

          <SubSectionTitle className="mb-6">Custom Borders & Shadows</SubSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="primary" border="white" shadow="double-white" className="p-4">
              <p className="font-mono text-white">Primary + White Border + Double White Shadow</p>
            </Card>
            <Card variant="secondary" border="accent" shadow="accent" className="p-4">
              <p className="font-mono text-white">Secondary + Accent Border + Accent Shadow</p>
            </Card>
            <Card variant="default" border="primary" shadow="primary" className="p-4">
              <p className="font-mono">Default + Primary Border + Primary Shadow</p>
            </Card>
            <Card variant="accent" border="error" shadow="error" className="p-4">
              <p className="font-mono text-white">Accent + Error Border + Error Shadow</p>
            </Card>
            <Card variant="subtle" border="secondary" shadow="double" className="p-4">
              <p className="font-mono">Subtle + Secondary Border + Double Shadow</p>
            </Card>
            <Card variant="dark" border="accent" shadow="triple" className="p-4">
              <p className="font-mono text-white">Dark + Accent Border + Triple Shadow</p>
            </Card>
          </div>
        </Card>

        {/* Typography Section */}
        <SectionTitle className="mb-8">Typography</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <div className="space-y-8">
            <div>
              <SubSectionTitle className="mb-4">Title Components</SubSectionTitle>
              <div className="space-y-4">
                <Title variant="page" className="mb-2">Page Title</Title>
                <Title variant="section" className="mb-2">Section Title</Title>
                <Title variant="subsection" className="mb-2">Subsection Title</Title>
                <SubSectionTitle rotation="slight-left" className="mb-2">Rotated Subsection</SubSectionTitle>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Text Components</SubSectionTitle>
              <div className="space-y-4">
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Body Text Variants:</Text>
                  <Text variant="body" size="lg" className="block mb-2">Large body text - perfect for introductions and important content</Text>
                  <Text variant="body" size="md" className="block mb-2">Medium body text - standard content and descriptions</Text>
                  <Text variant="body" size="sm" className="block mb-2">Small body text - compact content and fine print</Text>
                </div>
                
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Caption Text:</Text>
                  <Text variant="caption" size="lg" color="secondary" className="block mb-1">Large caption - metadata and timestamps</Text>
                  <Text variant="caption" size="md" color="secondary" className="block mb-1">Medium caption - standard metadata</Text>
                  <Text variant="caption" size="sm" color="secondary" className="block mb-1">Small caption - compact metadata</Text>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Label Text:</Text>
                  <Text variant="label" weight="bold" uppercase className="block mb-1">Bold Uppercase Label</Text>
                  <Text variant="label" weight="normal" className="block mb-1">Normal Label Text</Text>
                  <Text variant="label" weight="bold" color="error" className="block mb-1">Error Label</Text>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Color Variants:</Text>
                  <div className="flex flex-wrap gap-4">
                    <Text variant="body" color="primary">Primary</Text>
                    <Text variant="body" color="secondary">Secondary</Text>
                    <Text variant="body" color="accent">Accent</Text>
                    <Text variant="body" color="dark">Dark</Text>
                    <Text variant="body" color="error">Error</Text>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Badge Components</SubSectionTitle>
              <div className="space-y-4">
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Status Badges:</Text>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="status" color="error">OVERDUE</Badge>
                    <Badge variant="status" color="warning">DUE SOON</Badge>
                    <Badge variant="status" color="success">COMPLETED</Badge>
                    <Badge variant="status" color="primary">ACTIVE</Badge>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Category Badges:</Text>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="category" color="primary">HVAC</Badge>
                    <Badge variant="category" color="secondary">ELECTRICAL</Badge>
                    <Badge variant="category" color="accent">PLUMBING</Badge>
                    <Badge variant="category" color="dark">APPLIANCE</Badge>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Count Badges:</Text>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="count" color="error" size="sm">3</Badge>
                    <Badge variant="count" color="primary" size="md">12</Badge>
                    <Badge variant="count" color="accent" size="lg">47</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Stats Components</SubSectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stats 
                  value={47} 
                  label="Total Manuals" 
                  subtitle="+3 This Month"
                  size="lg" 
                  color="primary"
                />
                <Stats 
                  value="$2,340" 
                  label="Saved This Year" 
                  subtitle="vs $1,890 last year"
                  size="md" 
                  color="accent"
                />
                <Stats 
                  value={12} 
                  label="Due This Week" 
                  subtitle="3 overdue"
                  size="sm" 
                  color="error"
                />
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">TextLink Components</SubSectionTitle>
              <div className="space-y-4">
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Link Variants:</Text>
                  <div className="flex flex-wrap gap-4">
                    <TextLink to="/" variant="primary">Primary Link</TextLink>
                    <TextLink to="/" variant="secondary">Secondary Link</TextLink>
                    <TextLink to="/" variant="subtle">Subtle Link</TextLink>
                    <TextLink to="/" variant="danger">Danger Link</TextLink>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Internal vs External Links:</Text>
                  <div className="flex flex-wrap gap-4">
                    <TextLink to="/" variant="primary">Internal Route (React Router)</TextLink>
                    <TextLink href="https://example.com" target="_blank" variant="secondary">External URL</TextLink>
                    <TextLink onClick={() => alert('Clicked!')} variant="subtle">Click Handler</TextLink>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Link Sizes:</Text>
                  <div className="flex flex-wrap gap-4">
                    <TextLink to="/" variant="primary" size="sm">Small Link</TextLink>
                    <TextLink to="/" variant="primary" size="md">Medium Link</TextLink>
                    <TextLink to="/" variant="primary" size="lg">Large Link</TextLink>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Code Components</SubSectionTitle>
              <div className="space-y-4">
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Inline Code:</Text>
                  <Text variant="body">
                    Equipment model: <Code>ABC-123-XYZ</Code> with serial number <Code size="sm">987654321</Code>
                  </Text>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Block Code:</Text>
                  <Code variant="block" size="md">
Model: ABC-123-XYZ
Serial: 987654321
Manufactured: 2023-01-15
Warranty: 5 years
Last Service: 2024-06-15
                  </Code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Typography & Text Shadows Section */}
        <SectionTitle className="mb-8">Text Shadows</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <div className="space-y-8">
            <div>
              <SubSectionTitle className="mb-4">No Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="page" textShadow="none">
                  Page Title (No Shadow)
                </Title>
                <Title variant="section" textShadow="none">
                  Section Title (No Shadow)  
                </Title>
                <Title variant="subsection" textShadow="none">
                  Subsection Title (No Shadow)
                </Title>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Orange Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="page" textShadow="orange">
                  Page Title - Orange Shadow
                </Title>
                <Title variant="section" textShadow="orange">
                  Section Title - Orange Shadow
                </Title>
                <Title variant="subsection" textShadow="orange">
                  Subsection Title - Orange Shadow
                </Title>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Dark Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="page" textShadow="dark">
                  Page Title - Dark Shadow
                </Title>
                <Title variant="section" textShadow="dark">
                  Section Title - Dark Shadow
                </Title>
                <Title variant="subsection" textShadow="dark">
                  Subsection Title - Dark Shadow
                </Title>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Orange-Dark Double Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="page" textShadow="orange-dark">
                  Page Title - Orange + Dark Double
                </Title>
                <Title variant="section" textShadow="orange-dark">
                  Section Title - Orange + Dark Double
                </Title>
                <Title variant="subsection" textShadow="orange-dark">
                  Subsection Title - Orange + Dark Double
                </Title>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">Dark-Orange Double Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="page" textShadow="dark-orange">
                  Page Title - Dark + Orange Double
                </Title>
                <Title variant="section" textShadow="dark-orange">
                  Section Title - Dark + Orange Double
                </Title>
                <Title variant="subsection" textShadow="dark-orange">
                  Subsection Title - Dark + Orange Double
                </Title>
              </div>
            </div>
          </div>
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
                  onChange: async (e) => setPassword(e.target.value),
                  onBlur: async () => {},
                  ref: () => {},
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
              icon={<Home size={24} />}
              selected={selectedOption === 'create'}
              onClick={() => setSelectedOption('create')}
            />
            <OptionCard
              title="Join Existing Household"
              description="Use an invitation code to join"
              icon={<Key size={24} />}
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
              title="HVAC Filter Change"
              subtitle="Central Air System • 3rd Floor"
              status="urgent"
              dueDate="Due Tomorrow"
              actions={[
                { label: 'Mark Complete', onClick: () => alert('Marked complete'), variant: 'danger' },
                { label: 'Reschedule', onClick: () => alert('Reschedule clicked'), variant: 'outline' }
              ]}
            />
            <TaskCard
              title="Dishwasher Deep Clean"
              subtitle="Kitchen • Monthly maintenance"
              status="completed"
              dueDate="Completed Yesterday"
              actions={[
                { label: 'View Report', onClick: () => alert('View report'), variant: 'accent' },
                { label: 'Schedule Next', onClick: () => alert('Schedule next'), variant: 'outline' },
                { label: 'View Photos', onClick: () => alert('View photos'), variant: 'outline' }
              ]}
            />
            <TaskCard
              title="Pool Chemical Check"
              subtitle="Backyard Pool • Weekly task"
              status="normal"
              dueDate="Due in 3 Days"
              actions={[
                { label: 'Mark Complete', onClick: () => alert('Mark complete'), variant: 'secondary' },
                { label: 'Details', onClick: () => alert('View details'), variant: 'outline' }
              ]}
            />
            <TaskCard
              title="Emergency Repair"
              subtitle="Water heater replacement"
              status="completed"
              dueDate="Completed Last Week"
              actions={[
                { label: 'View Invoice', onClick: () => alert('View invoice'), variant: 'accent' },
                { label: 'Warranty Info', onClick: () => alert('Warranty info'), variant: 'outline' },
                { label: 'Contact Service', onClick: () => alert('Contact service'), variant: 'outline' },
                { label: 'Schedule Follow-up', onClick: () => alert('Schedule follow-up'), variant: 'outline' }
              ]}
            />
          </div>
        </Card>

        {/* List Items Section */}
        <SectionTitle className="mb-8">List Items</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <div className="space-y-4">
            <ListItem
              title="Review House Rules"
              subtitle="Last updated 2 days ago"
              actions={<Button variant="primary" size="sm">Edit</Button>}
            />
            <ListItem
              title="Complete Monthly Budget"
              subtitle="Due in 3 days"
              status="urgent"
              actions={<Button variant="danger" size="sm">Complete Now</Button>}
            />
            <ListItem
              title="Schedule Maintenance"
              subtitle="HVAC check completed"
              status="completed"
              actions={<Button variant="outline" size="sm">View Details</Button>}
            />
            <ListItem
              title="Update Emergency Contacts"
              subtitle="Requires attention"
              status="info"
              hover
              onClick={() => alert('List item clicked')}
            />
          </div>
        </Card>

        {/* Background Components */}
        <section>
          <Title variant="section" className="mb-6">
            Background Components
          </Title>
          
          <Title variant="subsection" className="mb-4">
            Individual Background Patterns
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative h-64 bg-background border-4 border-text-primary">
              <BackgroundCircles />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="primary" className="px-6 py-3">
                  <p className="font-mono text-white font-bold">Circles</p>
                </Card>
              </div>
            </div>
            
            <div className="relative h-64 bg-background border-4 border-text-primary">
              <BackgroundGrid />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="secondary" className="px-6 py-3">
                  <p className="font-mono text-white font-bold">Grid</p>
                </Card>
              </div>
            </div>
            
            <div className="relative h-64 bg-background border-4 border-text-primary">
              <BackgroundLines />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="accent" className="px-6 py-3">
                  <p className="font-mono text-white font-bold">Lines</p>
                </Card>
              </div>
            </div>
            
            <div className="relative h-64 bg-background border-4 border-text-primary">
              <BackgroundSquares />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="danger" className="px-6 py-3">
                  <p className="font-mono text-white font-bold">Squares</p>
                </Card>
              </div>
            </div>
          </div>

          <Title variant="subsection" className="mb-4">
            Layered Background Patterns
          </Title>
          <div className="space-y-6 mb-8">
            <div className="relative h-96 bg-background border-4 border-text-primary">
              <BackgroundCircles />
              <BackgroundGrid />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="dark" shadow="triple" className="p-8">
                  <Title variant="section" className="mb-4 text-white">
                    Layered Backgrounds
                  </Title>
                  <p className="font-mono text-white">
                    Testing multiple background patterns stacked together.
                    Circles + Grid combination creates interesting depth.
                  </p>
                </Card>
              </div>
            </div>
            
            <div className="relative h-96 bg-secondary border-4 border-text-primary">
              <BackgroundLines />
              <BackgroundSquares />
              <div className="absolute inset-0 flex items-center justify-center">
                <Card variant="primary" className="p-8">
                  <Title variant="section" className="mb-4 text-white">
                    Different Background Color
                  </Title>
                  <p className="font-mono text-white">
                    Testing patterns on different colored backgrounds.
                    Lines + Squares on secondary background.
                  </p>
                </Card>
              </div>
            </div>
          </div>

          <Card variant="dark" shadow="triple" className="p-8">
            <Title variant="section" className="mb-4 text-white">
              Background Pattern Notes
            </Title>
            <ul className="font-mono text-white space-y-2 text-sm">
              <li><strong>Circles:</strong> Original soft circles (not brutalist)</li>
              <li><strong>Grid:</strong> Sharp grid lines with brutal aesthetic</li>
              <li><strong>Lines:</strong> Diagonal lines for dynamic movement</li>
              <li><strong>Squares:</strong> Geometric shapes for structure</li>
              <li><strong>Layering:</strong> Multiple patterns can be combined</li>
              <li><strong>Colors:</strong> Patterns work on different backgrounds</li>
            </ul>
          </Card>
        </section>


        {/* Footer */}
        <Card variant="dark" shadow="triple" className="p-8">
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