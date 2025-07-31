import { Calendar, FileText, Database, Zap, Star, Menu, X, Home, WavesLadder } from 'lucide-react';
import { useState } from 'react';

// Backgrounds
import { BackgroundCircles } from '../../components/backgrounds/BackgroundCircles';
import { BackgroundGrid } from '../../components/backgrounds/BackgroundGrid';
import { BackgroundLines } from '../../components/backgrounds/BackgroundLines';
import { BackgroundRectangles } from '../../components/backgrounds/BackgroundRectangles';

// Common Components
import { BackgroundSquares } from '../../components/backgrounds/BackgroundSquares';
import { Action } from '../../components/common/Action';
import { Alert } from '../../components/common/Alert';
import { BackButton } from '../../components/common/BackButton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Code } from '../../components/common/Code';
import { ListItem } from '../../components/common/ListItem';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { Logo } from '../../components/common/Logo';
import { MediaCard } from '../../components/common/MediaCard';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SimpleListItem } from '../../components/common/SimpleListItem';
import { Stats } from '../../components/common/Stats';
import { Step, Steps } from '../../components/common/Steps';
import { Text } from '../../components/common/Text';
import { TextLink } from '../../components/common/TextLink';
import { Title } from '../../components/common/Title';

// Form Components
import { CheckBox } from '../../components/form/Checkbox';
import { PasswordStrengthIndicator } from '../../components/form/PasswordStrengthIndicator';
import { Select, Option } from '../../components/form/Select';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';

// Layout Components
import { FullWidthContainer } from '../../components/layout/containers/FullWidthContainer';
import { NarrowContainer } from '../../components/layout/containers/NarrowContainer';
import { SectionContainer } from '../../components/layout/containers/SectionContainer';
import { WideContainer } from '../../components/layout/containers/WideContainer';
import { Flex, Inline, Stack } from '../../components/layout/Flex';
import { Grid } from '../../components/layout/Grid';
import { Tabs } from '../../components/layout/Tabs';
import { TwoColumnLayout } from '../../components/layout/TwoColumnLayout';

// Variation Components
import { CodeInput } from '../../components/variations/CodeInput';
import { DefaultChoice } from '../../components/variations/DefaultChoice';
import { FilterChoice } from '../../components/variations/FilterChoice';
import { IconChoice } from '../../components/variations/IconChoice';
import { OptionCard } from '../../components/variations/OptionCard';
import { PriorityChoice } from '../../components/variations/PriorityChoice';
import { SectionTitle } from '../../components/variations/SectionTitle';
import { StatCard } from '../../components/variations/StatCard';
import { SubSectionTitle } from '../../components/variations/SubSectionTitle';
import { TaskCard } from '../../components/variations/TaskCard';

/**
 * KitchenSink Page - Comprehensive display of all base and variation components.
 * 
 * Used for testing, development, and design verification. Shows all component
 * variants, sizes, and states in one location.
 */

// Table of contents navigation component
const TableOfContents = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 'controls', label: 'Controls' },
    { id: 'cards', label: 'Cards' },
    { id: 'list', label: 'List Items' },
    { id: 'layouts', label: 'Layouts' },
    { id: 'forms', label: 'Forms' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'typography', label: 'Typography' },
    { id: 'backgrounds', label: 'Backgrounds' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Toggle Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 shadow-lg"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />} TOC
      </Button>

      {/* Navigation Menu */}
      {isOpen && (
        <Card variant="dark" shadow="triple" className="p-4 min-w-[200px]">
          <Text variant="label" weight="bold" color="white" className="block mb-3" uppercase>
            Quick Navigation
          </Text>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="block w-full text-left text-white hover:text-accent font-mono text-sm py-1 px-2 hover:bg-white/10 rounded transition-colors"
              >
                {section.label}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export function KitchenSink() {
  const [password] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Choice component states
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [frequency, setFrequency] = useState('');

  // Choice onChange handlers
  const handleCategoryChange = (value: string | string[]) => {
    setCategory(Array.isArray(value) ? value[0] || '' : value);
  };

  const handlePriorityChange = (value: string | string[]) => {
    setPriority(Array.isArray(value) ? value[0] || '' : value);
  };

  const handleFrequencyChange = (value: string | string[]) => {
    setFrequency(Array.isArray(value) ? value[0] || '' : value);
  };

  return (
    <div className="relative min-h-screen">
      {/* Table of Contents */}
      <TableOfContents />

      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundRectangles />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        <WideContainer className="py-10">
          <Title variant="page" textShadow="orange" className="mb-12">
            Component Kitchen Sink
          </Title>

          {/* Controls Section */}
          <section id="controls">
            <SectionTitle className="mb-8">Controls</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Button Variants</Text>
                  <Grid columns={3} spacing="sm" className="mb-6">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="text">Text</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="accent">Accent</Button>
                  </Grid>
                  <Text variant="label" weight="bold" className="block mb-4">Button Sizes & States</Text>
                  <Inline spacing="sm" className="flex-wrap mb-4">
                    <Button variant="primary" size="xs">X-Small</Button>
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Default / Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                    <Button variant="primary" size="xl">X-Large</Button>

                  </Inline>
                  <Inline className="mb-4">
                    <Button variant="primary" full>Full Width</Button>
                  </Inline>
                  <Inline spacing="sm" className="flex-wrap">
                    <Button variant="primary">Normal</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="primary" loading>Loading</Button>
                  </Inline>
                </div>

                <div>
                  <div className="space-y-4">
                    <Text variant="label" weight="bold" className="block mb-4">Actions</Text>
                    <Inline spacing="sm">
                      <Action>Dashboard</Action>
                      <Action variant="secondary">Settings</Action>
                      <Action variant="accent">Users</Action>
                    </Inline>
                    <Text variant="label" weight="bold" className="block mb-4">Back Buttons</Text>
                    <Inline spacing="sm">
                      <BackButton />
                      <BackButton label="Small" size="sm" />
                      <BackButton label="Cancel" size="md" variant="outline" />
                      <BackButton label="Return" size="lg" variant="text" />
                    </Inline>
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-12">
              <Text variant="label" weight="bold" className="block mb-6">Choice Components</Text>
              <Grid columns={2} spacing="lg">
                <div>
                  <Text variant="body" className="block mb-4">Default Choice</Text>
                  <DefaultChoice name="category" value={category} onChange={handleCategoryChange}>
                    <Option value="cleaning">Cleaning</Option>
                    <Option value="maintenance">Maintenance</Option>
                    <Option value="shopping">Shopping</Option>
                    <Option value="repairs">Repairs</Option>
                  </DefaultChoice>

                  <Text variant="body" className="block mb-4 mt-6">Filter Choice</Text>
                  <FilterChoice name="statusFilters" multiple>
                    <Option value="all">All</Option>
                    <Option value="overdue">Overdue</Option>
                    <Option value="due-soon">Due Soon</Option>
                    <Option value="completed">Completed</Option>
                  </FilterChoice>
                </div>

                <div>
                  <Text variant="body" className="block mb-4">Icon Choice</Text>
                  <IconChoice name="frequency" value={frequency} onChange={handleFrequencyChange}>
                    <Option value="once">One Time</Option>
                    <Option value="recurring">Recurring</Option>
                    <Option value="usage">Based on Usage</Option>
                  </IconChoice>
                  <IconChoice name="timeframe" className="mt-4">
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="monthly">Monthly</Option>
                    <Option value="yearly">Yearly</Option>
                  </IconChoice>

                  <Text variant="body" className="block mb-4 mt-6">Priority Choice</Text>
                  <PriorityChoice name="priority" value={priority} onChange={handlePriorityChange}>
                    <Option value="low">Low Priority</Option>
                    <Option value="medium">Medium Priority</Option>
                    <Option value="high">High Priority</Option>
                    <Option value="urgent">Urgent</Option>
                  </PriorityChoice>
                </div>
              </Grid>
            </Card>
          </section>

          {/* Cards Section */}
          <section id="cards">
            <SectionTitle className="mb-8">Cards</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Card Variants</SubSectionTitle>
              <Grid columns={4} spacing="md" className="mb-8">
                <Card variant="default" className="p-4">
                  <Text variant="body">Default</Text>
                </Card>
                <Card variant="subtle" className="p-4">
                  <Text variant="body">Subtle</Text>
                </Card>
                <Card variant="primary" className="p-4">
                  <Text variant="body" color="white">Primary</Text>
                </Card>
                <Card variant="secondary" className="p-4">
                  <Text variant="body" color="white">Secondary</Text>
                </Card>
                <Card variant="accent" className="p-4">
                  <Text variant="body" color="white">Accent</Text>
                </Card>
                <Card variant="danger" className="p-4">
                  <Text variant="body" color="white">Danger</Text>
                </Card>
                <Card variant="dark" className="p-4">
                  <Text variant="body" color="white">Dark</Text>
                </Card>
              </Grid>

              <SubSectionTitle className="mb-6">Shadow Combinations</SubSectionTitle>
              <Grid columns={3} spacing="md" className="mb-8">
                <Card variant="default" shadow="none" className="p-4">
                  <Text variant="body">No Shadow</Text>
                </Card>
                <Card variant="default" shadow="primary" className="p-4">
                  <Text variant="body">Primary Shadow</Text>
                </Card>
                <Card variant="default" shadow="secondary" className="p-4">
                  <Text variant="body">Secondary Shadow</Text>
                </Card>
                <Card variant="default" shadow="accent" className="p-4">
                  <Text variant="body">Accent Shadow</Text>
                </Card>
                <Card variant="default" shadow="dark" className="p-4">
                  <Text variant="body">Dark Shadow</Text>
                </Card>
                <Card variant="default" shadow="error" className="p-4">
                  <Text variant="body">Error Shadow</Text>
                </Card>
                <Card variant="default" shadow="double" className="p-4">
                  <Text variant="body">Double Shadow</Text>
                </Card>
                <Card variant="default" shadow="double-white" className="p-4">
                  <Text variant="body">Double White</Text>
                </Card>
                <Card variant="default" shadow="triple" className="p-4">
                  <Text variant="body">Triple Shadow</Text>
                </Card>
              </Grid>

              <SubSectionTitle className="mb-6">Rotation Effects</SubSectionTitle>
              <Grid columns={5} spacing="md" className="mb-8">
                <Card variant="primary" rotation="none" className="p-4">
                  <Text variant="body" color="white">No Rotation</Text>
                </Card>
                <Card variant="secondary" rotation="left" className="p-4">
                  <Text variant="body" color="white">Left</Text>
                </Card>
                <Card variant="accent" rotation="right" className="p-4">
                  <Text variant="body" color="white">Right</Text>
                </Card>
                <Card variant="primary" rotation="slight-left" className="p-4">
                  <Text variant="body" color="white">Slight Left</Text>
                </Card>
                <Card variant="secondary" rotation="slight-right" className="p-4">
                  <Text variant="body" color="white">Slight Right</Text>
                </Card>
              </Grid>

              <SubSectionTitle className="mb-6">Custom Borders & Shadows</SubSectionTitle>
              <Grid columns={3} spacing="md" className="mb-8">
                <Card variant="default" border="primary" shadow="primary" className="p-4">
                  <Text variant="body">Primary Border + Shadow</Text>
                </Card>
                <Card variant="default" border="accent" shadow="accent" className="p-4">
                  <Text variant="body">Accent Border + Shadow</Text>
                </Card>
                <Card variant="default" border="error" shadow="error" className="p-4">
                  <Text variant="body">Error Border + Shadow</Text>
                </Card>
                <Card variant="secondary" border="white" shadow="double-white" className="p-4">
                  <Text variant="body" color="white">White Border + Double White</Text>
                </Card>
                <Card variant="dark" border="accent" shadow="triple" className="p-4">
                  <Text variant="body" color="white">Mixed Border + Triple</Text>
                </Card>
                <Card variant="primary" border="dark" shadow="dark" className="p-4">
                  <Text variant="body" color="white">Dark Border + Shadow</Text>
                </Card>
              </Grid>

              <SubSectionTitle className="mb-6">Hover Effects</SubSectionTitle>
              <Grid columns={4} spacing="md" className="mb-8">
                <Card variant="default" hover hoverEffect="lift" className="p-4">
                  <Text variant="body">Hover Lift</Text>
                  <Text variant="caption" size="xs">Cards & Content</Text>
                </Card>
                <Card variant="primary" hover hoverEffect="press" className="p-4">
                  <Text variant="body" color="white">Hover Press</Text>
                  <Text variant="caption" color="white" size="xs">Buttons & CTAs</Text>
                </Card>
                <Card variant="secondary" hover hoverEffect="press-small" className="p-4">
                  <Text variant="body" color="white">Press Small</Text>
                  <Text variant="caption" color="white" size="xs">Small Elements</Text>
                </Card>
                <Card variant="accent" hoverEffect="none" className="p-4">
                  <Text variant="body" color="white">No Hover</Text>
                  <Text variant="caption" color="white" size="xs">Static Elements</Text>
                </Card>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-12">
              <Text variant="label" weight="bold" className="block mb-6">Card Variation Components</Text>
              <Grid columns={2} spacing="lg">
                <div>
                  <Text variant="body" className="block mb-4">Task Cards</Text>
                  <div className="space-y-3">
                    <TaskCard
                      title="Complete Project Documentation"
                      subtitle="Work • Development"
                      dueDate="Due in 2 days"
                      status="urgent"
                    />
                    <TaskCard
                      title="Review Code Changes"
                      subtitle="Development • Code Review"
                      dueDate="Due tomorrow"
                      status="normal"
                    />
                  </div>

                  <Text variant="body" className="block mb-4 mt-6">Option Cards</Text>
                  <Grid columns={2} spacing="sm">
                    <OptionCard
                      title="Basic Plan"
                      description="$9/month with basic features"
                      icon={<Database size={24} />}
                      selected={false}
                    />
                    <OptionCard
                      title="Pro Plan"
                      description="$19/month with advanced features"
                      icon={<Zap size={24} />}
                      selected={true}
                    />
                  </Grid>
                </div>

                <div>
                  <Text variant="body" className="block mb-4">Stat Cards</Text>
                  <Grid columns={2} spacing="sm" className="mb-6">
                    <StatCard
                      label="Active Tasks"
                      value="24"
                      subtitle="This week"
                      variant="primary"
                      size="sm"
                    />
                    <StatCard
                      label="Completed"
                      value="156"
                      subtitle="All time"
                      variant="accent"
                      size="sm"
                    />
                  </Grid>

                  <Text variant="body" className="block mb-4">Stats Component</Text>
                  <div className="space-y-4">
                    <Stats
                      value="1,234"
                      label="Total Items"
                      subtitle="All time"
                      size="lg"
                      progressValue={85}
                      progressColor="accent"
                    />
                    <Stats
                      value="567"
                      label="Active Tasks"
                      subtitle="This month"
                      size="md"
                      color="primary"
                    />
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Card Content Examples</SubSectionTitle>
              <div className="space-y-6">
                <Grid columns={2} spacing="lg">
                  <Card variant="default" shadow="double" rotation="slight-left" className="p-6" hover hoverEffect="lift">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary border-2 border-text-primary flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <Title variant="subsection" className="mb-2">Equipment Manual</Title>
                        <Text variant="caption" color="secondary" className="block mb-3">HVAC System Documentation</Text>
                        <div className="flex gap-2 mb-4">
                          <Badge variant="status" color="accent">Active</Badge>
                          <Badge variant="category" color="primary">HVAC</Badge>
                        </div>
                        <ProgressBar value={85} variant="accent" size="sm" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="primary" size="sm">View Manual</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </Card>

                  <Card variant="primary" shadow="triple" border="accent" className="p-6" hover hoverEffect="press">
                    <Stats
                      value="94%"
                      label="System Health"
                      subtitle="Last 30 days"
                      size="lg"
                      color="white"
                      progressValue={94}
                      progressColor="accent"
                    />
                    <div className="mt-6 pt-4 border-t-2 border-white/20">
                      <div className="flex justify-between items-center">
                        <Text variant="body" color="white" size="sm">Next maintenance in 15 days</Text>
                        <Button variant="outline" size="sm">Schedule</Button>
                      </div>
                    </div>
                  </Card>
                </Grid>

                <Grid columns={3} spacing="md">
                  <Card variant="subtle" shadow="primary" className="p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary border-2 border-text-primary mx-auto mb-3 flex items-center justify-center">
                        <Database size={24} className="text-white" />
                      </div>
                      <Title variant="subsection" className="mb-2">Data Export</Title>
                      <Text variant="caption" className="block mb-4">Export maintenance records and analytics</Text>
                      <Button variant="primary" size="sm" full>Export Data</Button>
                    </div>
                  </Card>

                  <Card variant="default" shadow="accent" rotation="slight-right" className="p-4">
                    <ListItem title="Water Heater Service" subtitle="Due in 3 days">
                      <ListItem.Badge variant="danger">Urgent</ListItem.Badge>
                      <ListItem.Actions>
                        <Button variant="primary" size="sm">Complete</Button>
                      </ListItem.Actions>
                    </ListItem>
                  </Card>

                  <Card variant="accent" shadow="double" className="p-4">
                    <MediaCard title="Pool Equipment" subtitle="Chemical treatment system">
                      <MediaCard.Avatar color="accent"><Star size={20} /></MediaCard.Avatar>
                      <MediaCard.Badge variant="success">Healthy</MediaCard.Badge>
                      <Text variant="caption" size="sm" className="mt-3 block">Last serviced 2 weeks ago</Text>
                    </MediaCard>
                  </Card>
                </Grid>
              </div>
            </Card>
          </section>


          {/* Display Section */}
          <section id="list">
            <SectionTitle className="mb-8">List Items</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">List Items</Text>
                  <div className="space-y-3">
                    <ListItem title="Task Item" subtitle="Due tomorrow">
                      <ListItem.Avatar color="primary"><Calendar size={20} /></ListItem.Avatar>
                      <ListItem.Actions>
                        <Button variant="text" size="sm">Edit</Button>
                      </ListItem.Actions>
                    </ListItem>
                    <SimpleListItem title="Document" subtitle="Last modified 2 hours ago">
                      <Button variant="outline" size="sm">View</Button>
                    </SimpleListItem>
                    <ListItem title="High Priority Task" subtitle="Overdue by 2 days" status="urgent">
                      <ListItem.Avatar color="danger"><Star size={20} /></ListItem.Avatar>
                      <ListItem.Badge variant="danger">Urgent</ListItem.Badge>
                    </ListItem>
                    <ListItem title="John Smith" subtitle="john@example.com • Admin" status="completed">
                      <ListItem.Avatar color="primary">JS</ListItem.Avatar>
                      <ListItem.Badge variant="accent">Admin</ListItem.Badge>
                      <ListItem.Actions>
                        <Action variant="outline">Edit Permissions</Action>
                      </ListItem.Actions>
                    </ListItem>

                    <ListItem title="Sarah Johnson" subtitle="sarah@example.com • Member">
                      <ListItem.Avatar color="secondary">SJ</ListItem.Avatar>
                      <ListItem.Badge variant="secondary">Member</ListItem.Badge>
                      <ListItem.Actions>
                        <Action variant="primary">Manage</Action>
                        <Action variant="outline">Remove</Action>
                      </ListItem.Actions>
                    </ListItem>

                    <ListItem title="Mike Wilson (Pending)" subtitle="mike.wilson@example.com • Invited 2 days ago" status="urgent">
                      <ListItem.Avatar color="default">MW</ListItem.Avatar>
                      <ListItem.Badge variant="danger">Pending</ListItem.Badge>
                      <ListItem.Actions>
                        <Action variant="primary">Resend Invite</Action>
                        <Action variant="outline">Cancel</Action>
                      </ListItem.Actions>
                    </ListItem>

                    <ListItem
                      title="Clickable Item"
                      subtitle="Entire item is clickable with hover effects"
                      hover
                      onClick={() => alert('NewListItem clicked!')}
                    >
                      <ListItem.Avatar color="primary"><Home /></ListItem.Avatar>
                      <ListItem.Badge variant="primary">Interactive</ListItem.Badge>
                    </ListItem>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Media Cards</Text>
                  <div className="space-y-4">
                    <MediaCard title="Sample Media" subtitle="Description text">
                      <MediaCard.Avatar color="primary"><FileText size={24} /></MediaCard.Avatar>
                      <MediaCard.Badge variant="secondary">Document</MediaCard.Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </MediaCard>
                    <MediaCard title="Another Item" subtitle="With different content" variant="accent">
                      <MediaCard.Avatar color="accent"><Database size={24} /></MediaCard.Avatar>
                      <MediaCard.Badge variant="success">Active</MediaCard.Badge>
                      <Text variant="body" size="sm">Additional content in card</Text>
                    </MediaCard>
                    <MediaCard title="Samsung Refrigerator" subtitle="Model: RF28T5001SR" variant="default">
                      <MediaCard.Badge variant="secondary">Kitchen</MediaCard.Badge>
                      <p className="text-sm mb-4">30-page manual covering installation, operation, and maintenance procedures.</p>
                      <Button variant="primary" size="sm">View Manual</Button>
                    </MediaCard>
                    <MediaCard title="Pool Equipment" subtitle="Hayward System • Backyard" variant="dark" rotation="slight-right">
                      <MediaCard.Avatar color="secondary"><WavesLadder /></MediaCard.Avatar>
                      <MediaCard.Badge variant="primary">Active</MediaCard.Badge>
                      <div className="space-y-3">
                        <div className="text-white">
                          <p className="text-sm font-bold">Pump Status: Running</p>
                          <p className="text-sm">Chemical Levels: Balanced</p>
                          <p className="text-sm">Temperature: 78°F</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm">Check Chemistry</Button>
                          <Button variant="outline" size="sm">View Logs</Button>
                        </div>
                      </div>
                    </MediaCard>
                    <MediaCard title="Multiple Badges" subtitle="Various status indicators" variant="default">
                      <MediaCard.Badge variant="primary">Priority</MediaCard.Badge>
                      <MediaCard.Badge variant="secondary">HVAC</MediaCard.Badge>
                      <MediaCard.Badge variant="success">Completed</MediaCard.Badge>
                      <p className="text-sm mt-3">Cards can display multiple badges that automatically wrap.</p>
                    </MediaCard>
                  </div>
                </div>
              </Grid>
            </Card>
          </section>

          {/* Layouts Section */}
          <section id="layouts">
            <SectionTitle className="mb-8">Layouts</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Grid Layout Demonstrations</SubSectionTitle>
              <div className="space-y-6">
                <div>
                  <Text variant="label" weight="bold" className="block mb-3">1 Column</Text>
                  <Grid columns={1} spacing="sm">
                    <div className="bg-primary p-4 text-white text-center font-mono">1</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">2 Columns</Text>
                  <Grid columns={2} spacing="sm">
                    <div className="bg-primary p-4 text-white text-center font-mono">1</div>
                    <div className="bg-secondary p-4 text-white text-center font-mono">2</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">3 Columns</Text>
                  <Grid columns={3} spacing="sm">
                    <div className="bg-primary p-4 text-white text-center font-mono">1</div>
                    <div className="bg-secondary p-4 text-white text-center font-mono">2</div>
                    <div className="bg-accent p-4 text-white text-center font-mono">3</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">4 Columns</Text>
                  <Grid columns={4} spacing="sm">
                    <div className="bg-primary p-4 text-white text-center font-mono">1</div>
                    <div className="bg-secondary p-4 text-white text-center font-mono">2</div>
                    <div className="bg-accent p-4 text-white text-center font-mono">3</div>
                    <div className="bg-error p-4 text-white text-center font-mono">4</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">6 Columns</Text>
                  <Grid columns={6} spacing="sm">
                    <div className="bg-primary p-3 text-white text-center font-mono text-sm">1</div>
                    <div className="bg-secondary p-3 text-white text-center font-mono text-sm">2</div>
                    <div className="bg-accent p-3 text-white text-center font-mono text-sm">3</div>
                    <div className="bg-error p-3 text-white text-center font-mono text-sm">4</div>
                    <div className="bg-dark p-3 text-white text-center font-mono text-sm">5</div>
                    <div className="bg-primary p-3 text-white text-center font-mono text-sm">6</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">12 Columns</Text>
                  <Grid columns={12} spacing="xs">
                    <div className="bg-primary p-2 text-white text-center font-mono text-xs">1</div>
                    <div className="bg-secondary p-2 text-white text-center font-mono text-xs">2</div>
                    <div className="bg-accent p-2 text-white text-center font-mono text-xs">3</div>
                    <div className="bg-error p-2 text-white text-center font-mono text-xs">4</div>
                    <div className="bg-dark p-2 text-white text-center font-mono text-xs">5</div>
                    <div className="bg-primary p-2 text-white text-center font-mono text-xs">6</div>
                    <div className="bg-secondary p-2 text-white text-center font-mono text-xs">7</div>
                    <div className="bg-accent p-2 text-white text-center font-mono text-xs">8</div>
                    <div className="bg-error p-2 text-white text-center font-mono text-xs">9</div>
                    <div className="bg-dark p-2 text-white text-center font-mono text-xs">10</div>
                    <div className="bg-primary p-2 text-white text-center font-mono text-xs">11</div>
                    <div className="bg-secondary p-2 text-white text-center font-mono text-xs">12</div>
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">Grid Spacing Variations</Text>
                  <div className="space-y-4">
                    <div>
                      <Text variant="caption" className="block mb-2">No spacing (spacing="none")</Text>
                      <Grid columns={4} spacing="none">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Extra Small spacing (spacing="xs")</Text>
                      <Grid columns={4} spacing="xs">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Small spacing (spacing="sm")</Text>
                      <Grid columns={4} spacing="sm">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Medium spacing (spacing="md")</Text>
                      <Grid columns={4} spacing="md">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Large spacing (spacing="lg")</Text>
                      <Grid columns={4} spacing="lg">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Extra Large spacing (spacing="xl")</Text>
                      <Grid columns={4} spacing="xl">
                        <div className="bg-primary p-3 text-white text-center font-mono">1</div>
                        <div className="bg-secondary p-3 text-white text-center font-mono">2</div>
                        <div className="bg-accent p-3 text-white text-center font-mono">3</div>
                        <div className="bg-error p-3 text-white text-center font-mono">4</div>
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Layout Containers</SubSectionTitle>
              <div className="space-y-8">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Container Widths</Text>
                  <div className="space-y-6">
                    <div>
                      <Text variant="caption" className="block mb-2">NarrowContainer - For focused content like forms</Text>
                      <NarrowContainer>
                        <Card variant="primary" className="p-4 text-center">
                          <Text variant="body" color="white">Narrow Container Content</Text>
                        </Card>
                      </NarrowContainer>
                    </div>

                    <div>
                      <Text variant="caption" className="block mb-2">SectionContainer - For section content</Text>
                      <SectionContainer>
                        <Card variant="secondary" className="p-4 text-center">
                          <Text variant="body" color="white">Section Container Content</Text>
                        </Card>
                      </SectionContainer>
                    </div>

                    <div>
                      <Text variant="caption" className="block mb-2">WideContainer - For dashboard layouts</Text>
                      <Card variant="accent" className="p-4 text-center">
                        <Text variant="body" color="white">Wide Container Content (current page container)</Text>
                      </Card>
                    </div>

                    <div>
                      <Text variant="caption" className="block mb-2">FullWidthContainer - For full-width sections</Text>
                      <FullWidthContainer>
                        <Card variant="dark" className="p-4 text-center">
                          <Text variant="body" color="white">Full Width Container Content</Text>
                        </Card>
                      </FullWidthContainer>
                    </div>
                  </div>
                </div>

                <div className="border-4 border-text-primary bg-background">
                  <TwoColumnLayout variant="sidebar-left" sidebarWidth="narrow" spacing="sm">
                    <TwoColumnLayout.Content>
                      <Stack spacing="lg">
                        <Flex spacing="md" className="justify-between items-center">
                          <Text weight="bold" size="lg">Main Content</Text>
                          <Button variant="primary" size="sm">Add New</Button>
                        </Flex>

                        <Grid columns={2} spacing="md">
                          <Card padding="md" shadow="primary">
                            <Text weight="bold">Content Block 1</Text>
                            <Text size="sm" color="secondary">Sample content area</Text>
                          </Card>
                          <Card padding="md" shadow="primary">
                            <Text weight="bold">Content Block 2</Text>
                            <Text size="sm" color="secondary">Another content area</Text>
                          </Card>
                        </Grid>
                      </Stack>
                    </TwoColumnLayout.Content>
                    <TwoColumnLayout.Sidebar width="narrow" variant="primary" shadow="none" className="border-4 border-dark !h-96">
                      <Stack spacing="md">
                        <Text weight="bold" color="white">Navigation</Text>
                        <Stack spacing="sm">
                          <Button variant="outline" full size="sm">Dashboard</Button>
                          <Button variant="secondary" full size="sm">Projects</Button>
                          <Button variant="outline" full size="sm">Settings</Button>
                          <Button variant="outline" full size="sm">Profile</Button>
                        </Stack>
                      </Stack>
                    </TwoColumnLayout.Sidebar>
                  </TwoColumnLayout>
                </div>
              </div>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Logo Component</SubSectionTitle>
              <Grid columns={2} spacing="lg">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Logo Sizes</Text>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Logo responsiveSize="sm" />
                      <Text variant="body">Small Logo (sm)</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <Logo responsiveSize="md" />
                      <Text variant="body">Medium Logo (md)</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <Logo responsiveSize="lg" />
                      <Text variant="body">Large Logo (lg)</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <Logo responsiveSize="xl" />
                      <Text variant="body">Extra Large Logo (xl)</Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Logo on Different Backgrounds</Text>
                  <div className="space-y-4">
                    <Card variant="default" className="p-4 flex items-center justify-center">
                      <Logo responsiveSize="md" />
                    </Card>
                    <Card variant="dark" className="p-4 flex items-center justify-center">
                      <Logo responsiveSize="md" />
                    </Card>
                    <Card variant="primary" className="p-4 flex items-center justify-center">
                      <Logo responsiveSize="md" />
                    </Card>
                    <Card variant="secondary" className="p-4 flex items-center justify-center">
                      <Logo responsiveSize="md" />
                    </Card>
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Text variant="label" weight="bold" className="block mb-4">Tabs</Text>
              <Tabs defaultTab="home">
                <Tabs.List>
                  <Tabs.Button value="home">Home</Tabs.Button>
                  <Tabs.Button value="settings">Settings</Tabs.Button>
                  <Tabs.Button value="profile">Profile</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="home">
                  <div className="p-4">
                    <Text variant="body">Home tab content with dashboard overview and recent activity.</Text>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value="settings">
                  <div className="p-4">
                    <Text variant="body">Settings tab content with configuration options.</Text>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value="profile">
                  <div className="p-4">
                    <Text variant="body">Profile tab content with user information.</Text>
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-12">
              <Text variant="label" weight="bold" className="block mb-4">Steps</Text>
              <Steps>
                <Step completed>Account Setup</Step>
                <Step active>Profile Information</Step>
                <Step>Configuration</Step>
                <Step>Launch</Step>
              </Steps>

              <Text variant="label" weight="bold" className="block mb-4 mt-6">Steps (Vertical)</Text>
              <Steps orientation="vertical">
                <Step completed>Installation</Step>
                <Step completed>Setup</Step>
                <Step active>Configuration</Step>
                <Step>Testing</Step>
                <Step>Launch</Step>
              </Steps>
            </Card>
          </section>

          {/* Forms Section */}
          <section id="forms">
            <SectionTitle className="mb-8">Forms</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">TextInput Size Variations</SubSectionTitle>
              <Grid columns={2} spacing="lg" className="mb-8">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Default Variant Sizes</Text>
                  <div className="space-y-4">
                    <TextInput
                      type="text"
                      label="Extra Small (xs)"
                      placeholder="Extra small input..."
                      size="xs"
                    />
                    <TextInput
                      type="text"
                      label="Small (sm)"
                      placeholder="Small input..."
                      size="sm"
                    />
                    <TextInput
                      type="text"
                      label="Medium (md) - Default"
                      placeholder="Medium input..."
                      size="md"
                    />
                    <TextInput
                      type="text"
                      label="Large (lg)"
                      placeholder="Large input..."
                      size="lg"
                    />
                    <TextInput
                      type="text"
                      label="Extra Large (xl)"
                      placeholder="Extra large input..."
                      size="xl"
                    />
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Search Variant & States</Text>
                  <div className="space-y-4">
                    <TextInput
                      type="text"
                      label="Search Variant (Medium)"
                      placeholder="Search..."
                      variant="search"
                      size="md"
                    />
                    <TextInput
                      type="email"
                      label="Email Input with Value"
                      placeholder="email@example.com"
                      defaultValue="user@example.com"
                      size="md"
                    />
                    <TextInput
                      type="text"
                      label="Error State"
                      placeholder="Invalid input"
                      error="This field is required"
                      size="md"
                    />
                    <TextInput
                      type="text"
                      label="Disabled Input"
                      placeholder="Cannot edit"
                      disabled
                      size="md"
                    />
                    <TextInput
                      type="password"
                      label="Password Input"
                      placeholder="Enter password..."
                      size="md"
                    />
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">TextArea Size Variations</SubSectionTitle>
                  <div className="space-y-4">
                    <TextArea
                      label="Extra Small TextArea (xs)"
                      placeholder="Extra small text area..."
                      rows={3}
                      size="xs"
                    />
                    <TextArea
                      label="Small TextArea (sm)"
                      placeholder="Small text area..."
                      rows={3}
                      size="sm"
                    />
                    <TextArea
                      label="Medium TextArea (md) - Default"
                      placeholder="Medium text area..."
                      rows={4}
                      size="md"
                    />
                    <TextArea
                      label="Large TextArea (lg)"
                      placeholder="Large text area..."
                      rows={4}
                      size="lg"
                    />
                    <TextArea
                      label="Extra Large TextArea (xl)"
                      placeholder="Extra large text area..."
                      rows={5}
                      size="xl"
                    />
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">TextArea States</SubSectionTitle>
                  <div className="space-y-4">
                    <TextArea
                      label="Default State"
                      placeholder="Enter detailed description..."
                      rows={4}
                    />
                    <TextArea
                      label="With Value"
                      placeholder="Description..."
                      rows={4}
                    />
                    <TextArea
                      label="Error State"
                      placeholder="Required field..."
                      error="Description must be at least 10 characters"
                      rows={4}
                    />
                    <TextArea
                      label="Disabled State"
                      placeholder="Cannot edit..."
                      disabled
                      rows={3}
                    />
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">Select Size & Variant Examples</SubSectionTitle>
                  <div className="space-y-4">
                    <Select
                      label="Extra Small Select (xs)"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      size="xs"
                    >
                      <Option value="xs">Extra Small</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>

                    <Select
                      label="Small Select (sm)"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      size="sm"
                    >
                      <Option value="sm">Small</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>

                    <Select
                      label="Medium Select (md) - Default"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose category..."
                      size="md"
                    >
                      <Option value="personal">Personal</Option>
                      <Option value="work">Work</Option>
                      <Option value="family">Family</Option>
                      <Option value="other">Other</Option>
                    </Select>

                    <Select
                      label="Large Select (lg)"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      size="lg"
                    >
                      <Option value="lg">Large</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>

                    <Select
                      label="Extra Large Select (xl)"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      size="xl"
                    >
                      <Option value="xl">Extra Large</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">Select States & Variants</SubSectionTitle>
                  <div className="space-y-4">
                    <Select
                      label="Default Variant"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      variant="default"
                    >
                      <Option value="option1">Default Option</Option>
                      <Option value="option2">Another Option</Option>
                    </Select>

                    <Select
                      label="Subtle Variant"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                    >
                      <Option value="option1">Subtle Option</Option>
                      <Option value="option2">Another Option</Option>
                    </Select>

                    <Select
                      label="With Selected Value"
                      value="selected"
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                    >
                      <Option value="selected">Selected Option</Option>
                      <Option value="option2">Other Option</Option>
                    </Select>

                    <Select
                      label="Error State"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Choose option..."
                      error="Please select an option"
                    >
                      <Option value="option1">Option 1</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>

                    <Select
                      label="Disabled State"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Cannot select..."
                      disabled
                    >
                      <Option value="option1">Option 1</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">Checkbox</SubSectionTitle>
                  <div className="space-y-4">
                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Default Checkboxes</Text>
                      <div className="space-y-2">
                        <CheckBox label="Unchecked checkbox" />
                        <CheckBox label="Checked by default" defaultChecked />
                        <CheckBox label="Disabled unchecked" disabled />
                        <CheckBox label="Disabled checked" disabled defaultChecked />
                      </div>
                    </div>

                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Checkbox Sizes</Text>
                      <div className="space-y-2">
                        <CheckBox label="Small checkbox (sm)" size="sm" />
                        <CheckBox label="Medium checkbox (md) - Default" size="md" />
                        <CheckBox label="Large checkbox (lg)" size="lg" />
                      </div>
                    </div>

                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Checkbox with Long Labels</Text>
                      <div className="space-y-2">
                        <CheckBox label="This is a very long checkbox label that wraps to multiple lines to demonstrate how the component handles longer text content" />
                        <CheckBox label="Another long label with multiple words that should wrap properly and maintain good alignment with the checkbox input" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">Special Input Components</SubSectionTitle>
                  <div className="space-y-6">
                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Code Input Variations</Text>
                      <div className="space-y-4">
                        <CodeInput
                          label="4-Digit Code"
                          maxLength={4}
                        />
                        <CodeInput
                          label="6-Digit Verification Code"
                          maxLength={6}
                        />
                        <CodeInput
                          label="8-Character Code"
                          maxLength={8}
                        />
                      </div>
                    </div>

                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Password Strength</Text>
                      <div className="space-y-4">
                        <div>
                          <TextInput
                            type="password"
                            label="Password with Strength Indicator"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(_e) => { }} // Note: password state is readonly in this demo
                          />
                          <PasswordStrengthIndicator password={password} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Card>
          </section>

          {/* Feedback Section */}
          <section id="feedback">
            <SectionTitle className="mb-8">Feedback</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Alert Size Variations</SubSectionTitle>
              <Grid columns={2} spacing="lg" className="mb-8">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Alert Sizes (Info Variant)</Text>
                  <div className="space-y-4">
                    <Alert variant="info" size="xs">
                      Extra small alert message for minimal notices.
                    </Alert>
                    <Alert variant="info" size="sm">
                      Small alert message for compact notifications.
                    </Alert>
                    <Alert variant="info" size="md">
                      Medium alert message - default size for most situations.
                    </Alert>
                    <Alert variant="info" size="lg">
                      Large alert message for important information that needs attention.
                    </Alert>
                    <Alert variant="info" size="xl">
                      Extra large alert message for critical announcements and major updates.
                    </Alert>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Alert Variants (Medium Size)</Text>
                  <div className="space-y-4">
                    <Alert variant="info" size="md">
                      Informational alert with helpful details and guidance.
                    </Alert>
                    <Alert variant="success" size="md">
                      Success alert for completed actions and positive feedback.
                    </Alert>
                    <Alert variant="warning" size="md">
                      Warning alert for potential issues requiring attention.
                    </Alert>
                    <Alert variant="error" size="md">
                      Error alert for problems and failed operations.
                    </Alert>
                    <Alert variant="basic" size="md">
                      Basic alert for general announcements and neutral information.
                    </Alert>
                  </div>
                </div>
              </Grid>

              <SubSectionTitle className="mb-4">Alert with Custom Icons</SubSectionTitle>
              <Grid columns={3} spacing="md" className="mb-8">
                <Alert variant="success" size="md" icon={<Database size={20} />}>
                  Data export completed successfully with custom database icon.
                </Alert>
                <Alert variant="warning" size="md" hideIcon>
                  Warning alert with icon hidden for clean text-only appearance.
                </Alert>
                <Alert variant="info" size="lg" icon={<Zap size={24} />}>
                  System maintenance scheduled with custom lightning icon.
                </Alert>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <SubSectionTitle className="mb-6">Progress Bar Variants & Sizes</SubSectionTitle>
              <Grid columns={2} spacing="lg" className="mb-8">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Progress Bar Sizes</Text>
                  <div className="space-y-6">
                    <div>
                      <Text variant="caption" className="block mb-2">Extra Small (xs) - 4px height</Text>
                      <ProgressBar value={75} size="xs" variant="primary" />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Small (sm) - 6px height</Text>
                      <ProgressBar value={60} size="sm" variant="secondary" />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Medium (md) - 20px height with text</Text>
                      <ProgressBar value={85} size="md" variant="accent" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Large (lg) - 24px height with text</Text>
                      <ProgressBar value={45} size="lg" variant="primary" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Extra Large (xl) - 32px height with text</Text>
                      <ProgressBar value={92} size="xl" variant="success" showPercentage />
                    </div>
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Progress Bar Color Variants</Text>
                  <div className="space-y-6">
                    <div>
                      <Text variant="caption" className="block mb-2">Primary (Orange)</Text>
                      <ProgressBar value={70} variant="primary" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Secondary (Blue)</Text>
                      <ProgressBar value={55} variant="secondary" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Accent (Green)</Text>
                      <ProgressBar value={88} variant="accent" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Error (Red)</Text>
                      <ProgressBar value={25} variant="error" showPercentage />
                    </div>
                    <div>
                      <Text variant="caption" className="block mb-2">Dark (Black)</Text>
                      <ProgressBar value={66} variant="dark" showPercentage />
                    </div>
                  </div>
                </div>
              </Grid>

              <SubSectionTitle className="mb-4">Progress Bars with Labels</SubSectionTitle>
              <div className="space-y-4 mb-8">
                <ProgressBar
                  value={75}
                  label="HVAC System Health"
                  showPercentage
                  variant="accent"
                  size="lg"
                />
                <ProgressBar
                  value={45}
                  label="Manual Upload Progress"
                  showPercentage
                  variant="primary"
                  size="md"
                />
                <ProgressBar
                  value={90}
                  label="Database Backup Complete"
                  showPercentage
                  variant="success"
                  size="lg"
                />
                <ProgressBar
                  value={15}
                  label="Storage Space Remaining"
                  showPercentage
                  variant="error"
                  size="md"
                />
              </div>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">Loading Indicators</SubSectionTitle>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <LoadingIndicator inline size="sm" />
                      <Text variant="body" size="sm">Small loading indicator</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <LoadingIndicator inline size="md" />
                      <Text variant="body" size="md">Medium loading indicator</Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <LoadingIndicator inline size="lg" />
                      <Text variant="body" size="lg">Large loading indicator</Text>
                    </div>
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">Modal Component</SubSectionTitle>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Modal
                  </Button>

                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    ariaLabelledBy="modal-title"
                  >
                    <div className="p-8 max-w-lg">
                      <Title variant="subsection" className="mb-4">
                        Example Modal
                      </Title>
                      <Text variant="body" className="mb-6">
                        Modal dialog with form elements and actions.
                      </Text>
                      <div className="space-y-4 mb-6">
                        <TextInput
                          type="text"
                          label="Sample Input"
                          placeholder="Type something..."
                        />
                        <CheckBox label="Sample checkbox option" />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            alert('Confirmed!');
                            setIsModalOpen(false);
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>
              </Grid>
            </Card>
          </section>

          {/* Typography Section */}
          <section id="typography">
            <SectionTitle className="mb-8">Typography</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">Title Components</SubSectionTitle>
                  <div className="space-y-4 mb-8">
                    <Title variant="page">Page Title</Title>
                    <Title variant="page" textShadow="orange">Page Title (Orange Shadow)</Title>
                    <Title variant="page" textShadow="dark">Page Title (Dark Shadow)</Title>
                    <Title variant="section">Section Title</Title>
                    <Title variant="section" textShadow="orange">Section Title (Orange Shadow)</Title>
                    <Title variant="section" textShadow="dark">Section Title (Dark Shadow)</Title>
                    <Title variant="subsection">Subsection Title</Title>
                    <Title variant="subsection" textShadow="orange">Subsection Title (Orange Shadow)</Title>
                    <Title variant="subsection" textShadow="dark">Subsection Title (Dark Shadow)</Title>
                    <SectionTitle>Section Title Component</SectionTitle>
                    <SubSectionTitle>SubSection Title Component</SubSectionTitle>
                    <SubSectionTitle rotation="slight-left">Rotated SubSection</SubSectionTitle>
                  </div>

                  <SubSectionTitle className="mb-4">Text Shadows (All Variants)</SubSectionTitle>
                  <div className="space-y-4 mb-8">
                    <Title variant="subsection">No Shadow</Title>
                    <Title variant="subsection" textShadow="orange">Orange Shadow</Title>
                    <Title variant="subsection" textShadow="dark">Dark Shadow</Title>
                    <Title variant="subsection" textShadow="orange-dark">Orange-Dark Shadow</Title>
                    <Title variant="subsection" textShadow="dark-orange">Dark-Orange Shadow</Title>
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">Text Components</SubSectionTitle>
                  <div className="space-y-4 mb-8">
                    <div>
                      <Text variant="body" size="xs">Body text extra small - Used for fine print and disclaimers.</Text>
                    </div>
                    <div>
                      <Text variant="body" size="sm">Body text small - Perfect for secondary information and metadata.</Text>
                    </div>
                    <div>
                      <Text variant="body" size="md">Body text medium - The default size for most paragraph content.</Text>
                    </div>
                    <div>
                      <Text variant="body" size="lg">Body text large - Ideal for introductory paragraphs and emphasis.</Text>
                    </div>
                    <div>
                      <Text variant="body" size="xl">Body text extra large - Great for lead paragraphs and callouts.</Text>
                    </div>
                    <div>
                      <Text variant="label" weight="normal">Label normal weight - Used for form labels and light emphasis.</Text>
                    </div>
                    <div>
                      <Text variant="label" weight="bold">Label bold weight - Standard weight for most UI labels and headings.</Text>
                    </div>
                    <div>
                      <Text variant="label" weight="black">Label black weight - Maximum emphasis for critical information.</Text>
                    </div>
                    <div>
                      <Text variant="caption" size="xs">Caption extra small - Minimal text for timestamps and subtle details.</Text>
                    </div>
                    <div>
                      <Text variant="caption" size="sm">Caption small - Standard size for photo captions and help text.</Text>
                    </div>
                    <div>
                      <Text variant="caption" size="md">Caption medium - Larger captions for better readability on mobile.</Text>
                    </div>
                  </div>

                  <SubSectionTitle className="mb-4">Text Colors</SubSectionTitle>
                  <div className="space-y-2 mb-8">
                    <Text variant="body" color="primary">Primary color - Used for main brand elements and key actions.</Text>
                    <Text variant="body" color="secondary">Secondary color - Perfect for supporting information and secondary actions.</Text>
                    <Text variant="body" color="accent">Accent color - Highlights success states and positive feedback.</Text>
                    <Text variant="body" color="dark">Dark color - Standard text color for maximum readability and contrast.</Text>
                    <Text variant="body" color="error">Error color - Indicates warnings, errors, and critical information.</Text>
                    <Text variant="body" color="white" className="bg-dark p-2">White color - Used on dark backgrounds for proper contrast.</Text>
                  </div>
                </div>
              </Grid>
            </Card>

            <Card variant="default" shadow="triple" className="p-8 mb-8">
              <Grid columns={2} spacing="lg">
                <div>
                  <SubSectionTitle className="mb-4">TextLink Components</SubSectionTitle>
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-4">
                      <TextLink to="/" variant="primary">Primary Link</TextLink>
                      <TextLink to="/" variant="secondary">Secondary Link</TextLink>
                      <TextLink to="/" variant="subtle">Subtle Link</TextLink>
                      <TextLink to="/" variant="danger">Danger Link</TextLink>
                    </div>
                    <div className="flex gap-4">
                      <TextLink to="/" variant="primary">Internal Route</TextLink>
                      <TextLink href="https://example.com" target="_blank" variant="secondary">External URL</TextLink>
                      <TextLink onClick={() => alert('Clicked!')} variant="subtle">Click Handler</TextLink>
                    </div>
                    <div className="flex gap-4">
                      <TextLink to="/" variant="primary" size="sm">Small Link</TextLink>
                      <TextLink to="/" variant="primary" size="md">Medium Link</TextLink>
                      <TextLink to="/" variant="primary" size="lg">Large Link</TextLink>
                    </div>
                  </div>

                  <SubSectionTitle className="mb-4">Stats Components</SubSectionTitle>
                  <div className="space-y-6">
                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">Size Variants</Text>
                      <Grid columns={2} spacing="sm">
                        <Stats
                          value="42"
                          label="Small Stats"
                          subtitle="All time"
                          size="sm"
                          color="primary"
                        />
                        <Stats
                          value="1,234"
                          label="Medium Stats"
                          subtitle="This month"
                          size="md"
                          color="secondary"
                        />
                        <Stats
                          value="99.9%"
                          label="Large Stats"
                          subtitle="Uptime"
                          size="lg"
                          color="accent"
                        />
                      </Grid>
                    </div>
                    <div>
                      <Text variant="label" weight="bold" className="block mb-3">With Progress Bars</Text>
                      <Grid columns={2} spacing="md">
                        <Stats
                          value="85%"
                          label="Equipment Health"
                          subtitle="Last 30 days"
                          size="md"
                          color="accent"
                          progressValue={85}
                          progressColor="accent"
                        />
                        <Stats
                          value="12"
                          label="Due This Week"
                          subtitle="+3 from last week"
                          size="md"
                          color="error"
                          progressValue={75}
                          progressColor="primary"
                        />
                      </Grid>
                    </div>
                  </div>
                </div>

                <div>
                  <SubSectionTitle className="mb-4">Code Components</SubSectionTitle>
                  <div className="space-y-3 mb-8">
                    <Code>inline code example</Code>
                    <Code>npm install @homekeeper/components</Code>
                    <Code>const example = 'syntax highlighting';</Code>
                  </div>

                  <SubSectionTitle className="mb-4">Badge Components</SubSectionTitle>
                  <div className="space-y-4 mb-8">
                    <div>
                      <Text variant="label" weight="bold" className="block mb-2">Status Badges</Text>
                      <Inline spacing="sm" className="flex-wrap">
                        <Badge variant="status" color="primary">Active</Badge>
                        <Badge variant="status" color="secondary">Pending</Badge>
                        <Badge variant="status" color="accent">Featured</Badge>
                        <Badge variant="status" color="error">Overdue</Badge>
                      </Inline>
                    </div>
                    <div>
                      <Text variant="label" weight="bold" className="block mb-2">Category Badges</Text>
                      <Inline spacing="sm" className="flex-wrap">
                        <Badge variant="category" color="primary">HVAC</Badge>
                        <Badge variant="category" color="secondary">Plumbing</Badge>
                        <Badge variant="category" color="accent">Electric</Badge>
                      </Inline>
                    </div>
                    <div>
                      <Text variant="label" weight="bold" className="block mb-2">Count Badges</Text>
                      <Inline spacing="sm" className="flex-wrap">
                        <Badge variant="count" color="primary">5</Badge>
                        <Badge variant="count" color="secondary">12</Badge>
                        <Badge variant="count" color="accent">99+</Badge>
                      </Inline>
                    </div>
                  </div>
                </div>
              </Grid>
            </Card>
          </section>

          {/* Backgrounds Section */}
          <section id="backgrounds">
            <SectionTitle className="mb-8">Backgrounds</SectionTitle>

            <Card variant="default" shadow="triple" className="p-8 mb-12">
              <Text variant="label" weight="bold" className="block mb-6">Background Patterns</Text>
              <Grid columns={2} spacing="lg">
                <div className="space-y-6">
                  <div className="relative h-32 bg-background border-2 border-text-primary">
                    <BackgroundCircles />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Text variant="body" weight="bold">Circles</Text>
                    </div>
                  </div>

                  <div className="relative h-32 bg-background border-2 border-text-primary">
                    <BackgroundGrid />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Text variant="body" weight="bold">Grid</Text>
                    </div>
                  </div>

                  <div className="relative h-32 bg-background border-2 border-text-primary">
                    <BackgroundLines />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Text variant="body" weight="bold">Lines</Text>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative h-32 bg-background border-2 border-text-primary">
                    <BackgroundRectangles />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Text variant="body" weight="bold">Rectangles</Text>
                    </div>
                  </div>

                  <div className="relative h-32 bg-background border-2 border-text-primary">
                    <BackgroundSquares />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Text variant="body" weight="bold">Squares</Text>
                    </div>
                  </div>

                  <div className="relative h-32 bg-secondary border-2 border-text-primary">
                    <BackgroundCircles />
                    <BackgroundGrid />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Card variant="dark" className="p-4">
                        <Text variant="body" color="white" weight="bold">Layered</Text>
                      </Card>
                    </div>
                  </div>
                </div>
              </Grid>
            </Card>
          </section>
        </WideContainer>
      </div>
    </div>
  );
}