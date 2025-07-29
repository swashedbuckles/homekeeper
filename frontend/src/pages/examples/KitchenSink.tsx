import { Home, Key } from 'lucide-react';
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
import { WideContainer } from '../../components/layout/containers/WideContainer';
import { Inline } from '../../components/layout/Flex';
import { Grid } from '../../components/layout/Grid';
import { Tabs } from '../../components/layout/Tabs';

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
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'modals', label: 'Modals' },
    { id: 'typography', label: 'Typography' },
    { id: 'text-shadows', label: 'Text Shadows' },
    { id: 'forms', label: 'Form Components' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'steps', label: 'Steps' },
    { id: 'progress', label: 'Progress Components' },
    { id: 'choices', label: 'Choice Components' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'variations', label: 'Variation Components' },
    { id: 'list-items', label: 'List Items' },
    { id: 'new-list-items', label: 'New List Items (Compound)' },
    { id: 'media-cards', label: 'Media Cards (Compound)' },
    { id: 'action-component', label: 'Action Component' },
    { id: 'backgrounds', label: 'Background Components' }
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
        {isOpen ? '✕' : '☰'} TOC
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
  const [password, setPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Choice component states
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  
  // Choice onChange handlers
  const handleCategoryChange = (value: string | string[]) => {
    setCategory(Array.isArray(value) ? value[0] || '' : value);
  };
  
  const handlePriorityChange = (value: string | string[]) => {
    setPriority(Array.isArray(value) ? value[0] || '' : value);
  };
  
  const handleFiltersChange = (value: string | string[]) => {
    setFilters(Array.isArray(value) ? value : [value].filter(Boolean));
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


        {/* Buttons Section */}
        <section id="buttons">
          <SectionTitle className="mb-8">Buttons</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <SubSectionTitle className="mb-6">Button Variants</SubSectionTitle>
          <Grid columns={5} spacing="md" className="mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="accent">Accent</Button>
          </Grid>

          <SubSectionTitle className="mb-6">Button Sizes</SubSectionTitle>
          <Inline spacing="md" className="flex-wrap mb-8">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
          </Inline>

          <SubSectionTitle className="mb-6">Button States</SubSectionTitle>
          <Inline spacing="md" className="flex-wrap mb-8">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" full>Full Width</Button>
          </Inline>

          <SubSectionTitle className="mb-6">Back Button - StandardSize Options</SubSectionTitle>
          <div className="space-y-4">
            <Inline spacing="md">
              <BackButton label="XS Size" size="xs" />
              <BackButton label="Small" size="sm" />
              <BackButton label="Medium (Default)" size="md" />
              <BackButton label="Large" size="lg" />
              <BackButton label="Extra Large" size="xl" />
            </Inline>
            <Inline spacing="md">
              <BackButton variant="text" label="Text Style" size="sm" />
              <BackButton variant="outline" label="Outline Style" size="md" />
            </Inline>
          </div>
        </Card>
        </section>

        {/* Cards Section */}
        <section id="cards">
          <SectionTitle className="mb-8">Cards</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Card Variants</SubSectionTitle>
          <Grid columns={3} spacing="lg" className="mb-8">
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
          </Grid>

          <SubSectionTitle className="mb-6">Card Shadows & Rotations</SubSectionTitle>
          <Grid columns={4} spacing="lg" className="mb-8">
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
          </Grid>

          <SubSectionTitle className="mb-6">Card Hover Effects</SubSectionTitle>
          <Grid columns={4} spacing="lg" className="mb-6">
            <Card variant="default" hover hoverEffect="lift" className="p-4">
              <p className="font-mono text-xs uppercase">Lift</p>
              <p className="font-mono text-xs">Cards & Content</p>
            </Card>
            <Card variant="primary" hover hoverEffect="press" className="p-4">
              <p className="font-mono text-white text-xs uppercase">Press</p>
              <p className="font-mono text-white text-xs">Buttons & CTAs</p>
            </Card>
            <Card variant="secondary" hover hoverEffect="press-small" className="p-4">
              <p className="font-mono text-white text-xs uppercase">Press Small</p>
              <p className="font-mono text-white text-xs">Small Elements</p>
            </Card>
            <Card variant="accent" hoverEffect="none" className="p-4">
              <p className="font-mono text-white text-xs uppercase">None</p>
              <p className="font-mono text-white text-xs">Static Elements</p>
            </Card>
          </Grid>

          <SubSectionTitle className="mb-6">Custom Borders & Shadows</SubSectionTitle>
          <Grid columns={3} spacing="lg">
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
          </Grid>
        </Card>
        </section>

        {/* Modals Section */}
        <section id="modals">
          <SectionTitle className="mb-8">Modals</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <SubSectionTitle className="mb-6">Basic Modal</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <Text variant="body" className="mb-4">
              Click the button below to open a modal dialog. Test keyboard navigation (Escape to close), 
              focus management, and click-outside-to-close functionality.
            </Text>
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
          </div>

          {/* Modal Component */}
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
                This is a sample modal dialog. It demonstrates the modal component with proper 
                accessibility features, focus management, and neobrutalist styling.
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
        </Card>
        </section>

        {/* Typography Section */}
        <section id="typography">
          <SectionTitle className="mb-8">Typography</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <div className="space-y-8">
            <div>
              <SubSectionTitle className="mb-4">Title Components</SubSectionTitle>
              <div className="space-y-4">
                <Title variant="hero" className="mb-2">Hero Title (New!)</Title>
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
                  <Text variant="body" size="3xl" className="block mb-2">3XL body text - hero content and major headings (New!)</Text>
                  <Text variant="body" size="2xl" className="block mb-2">2XL body text - prominent content and subheadings (New!)</Text>
                  <Text variant="body" size="lg" className="block mb-2">Large body text - perfect for introductions and important content</Text>
                  <Text variant="body" size="md" className="block mb-2">Medium body text - standard content and descriptions</Text>
                  <Text variant="body" size="sm" className="block mb-2">Small body text - compact content and fine print</Text>
                </div>
                
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Caption Text:</Text>
                  <Text variant="caption" size="3xl" color="secondary" className="block mb-1">3XL caption - prominent metadata (New!)</Text>
                  <Text variant="caption" size="2xl" color="secondary" className="block mb-1">2XL caption - large metadata (New!)</Text>
                  <Text variant="caption" size="lg" color="secondary" className="block mb-1">Large caption - metadata and timestamps</Text>
                  <Text variant="caption" size="md" color="secondary" className="block mb-1">Medium caption - standard metadata</Text>
                  <Text variant="caption" size="sm" color="secondary" className="block mb-1">Small caption - compact metadata</Text>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Label Text:</Text>
                  <Text variant="label" size="3xl" weight="bold" uppercase className="block mb-1">3XL Bold Uppercase Label (New!)</Text>
                  <Text variant="label" size="2xl" weight="bold" className="block mb-1">2XL Bold Label (New!)</Text>
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
              <SubSectionTitle className="mb-4">Stats Components (Enhanced)</SubSectionTitle>
              <Text variant="body" size="sm" className="mb-6">
                Enhanced Stats component now supports progress indicators for completion percentages, health scores, and other metrics.
              </Text>
              
              <div className="space-y-8">
                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Basic Stats (No Progress):</Text>
                  <Grid columns={3} spacing="lg">
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
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Equipment Health with Progress:</Text>
                  <Grid columns={3} spacing="lg">
                    <Stats 
                      value="94%" 
                      label="HVAC System Health" 
                      subtitle="Last service: 2 months ago"
                      size="lg" 
                      color="accent"
                      progressValue={94}
                      progressColor="accent"
                    />
                    <Stats 
                      value="67%" 
                      label="Pool Equipment" 
                      subtitle="Filter needs attention"
                      size="md" 
                      color="primary"
                      progressValue={67}
                      progressColor="primary"
                    />
                    <Stats 
                      value="23%" 
                      label="Kitchen Appliances" 
                      subtitle="Multiple issues"
                      size="sm" 
                      color="error"
                      progressValue={23}
                      progressColor="error"
                    />
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Task Completion Progress:</Text>
                  <Grid columns={4} spacing="lg">
                    <Stats 
                      value="8/10" 
                      label="Daily Tasks" 
                      subtitle="Almost done!"
                      size="md" 
                      color="accent"
                      progressValue={80}
                      progressColor="accent"
                    />
                    <Stats 
                      value="15/25" 
                      label="Weekly Tasks" 
                      subtitle="On track"
                      size="md" 
                      color="secondary"
                      progressValue={60}
                      progressColor="secondary"
                    />
                    <Stats 
                      value="3/20" 
                      label="Monthly Goals" 
                      subtitle="Need to catch up"
                      size="md" 
                      color="primary"
                      progressValue={15}
                      progressColor="primary"
                    />
                    <Stats 
                      value="12/12" 
                      label="Annual Tasks" 
                      subtitle="Complete!"
                      size="md" 
                      color="accent"
                      progressValue={100}
                      progressColor="accent"
                    />
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Different Progress Colors:</Text>
                  <Grid columns={4} spacing="lg">
                    <Stats 
                      value="85%" 
                      label="Success Metric" 
                      subtitle="Excellent performance"
                      size="sm" 
                      color="accent"
                      progressValue={85}
                      progressColor="accent"
                    />
                    <Stats 
                      value="45%" 
                      label="Warning Zone" 
                      subtitle="Needs attention"
                      size="sm" 
                      color="primary"
                      progressValue={45}
                      progressColor="primary"
                    />
                    <Stats 
                      value="15%" 
                      label="Critical Status" 
                      subtitle="Immediate action"
                      size="sm" 
                      color="error"
                      progressValue={15}
                      progressColor="error"
                    />
                    <Stats 
                      value="72%" 
                      label="Information" 
                      subtitle="Regular status"
                      size="sm" 
                      color="secondary"
                      progressValue={72}
                      progressColor="secondary"
                    />
                  </Grid>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-4">Size Variants with Progress:</Text>
                  <div className="space-y-6">
                    <Stats 
                      value="92%" 
                      label="Extra Large Display" 
                      subtitle="Prominent dashboard metric"
                      size="xl" 
                      color="primary"
                      progressValue={92}
                      progressColor="primary"
                    />
                    <Stats 
                      value="78%" 
                      label="Large Dashboard Stat" 
                      subtitle="Main section display"
                      size="lg" 
                      color="accent"
                      progressValue={78}
                      progressColor="accent"
                    />
                    <Stats 
                      value="64%" 
                      label="Medium Card Metric" 
                      subtitle="Standard component size"
                      size="md" 
                      color="secondary"
                      progressValue={64}
                      progressColor="secondary"
                    />
                    <Stats 
                      value="41%" 
                      label="Small Inline Stat" 
                      subtitle="Compact display"
                      size="sm" 
                      color="primary"
                      progressValue={41}
                      progressColor="primary"
                    />
                    <Stats 
                      value="29%" 
                      label="Extra Small" 
                      subtitle="Minimal space"
                      size="xs" 
                      color="error"
                      progressValue={29}
                      progressColor="error"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SubSectionTitle className="mb-4">TextLink Components</SubSectionTitle>
              <div className="space-y-4">
                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Link Variants:</Text>
                  <Inline spacing="md" className="flex-wrap">
                    <TextLink to="/" variant="primary">Primary Link</TextLink>
                    <TextLink to="/" variant="secondary">Secondary Link</TextLink>
                    <TextLink to="/" variant="subtle">Subtle Link</TextLink>
                    <TextLink to="/" variant="danger">Danger Link</TextLink>
                  </Inline>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Internal vs External Links:</Text>
                  <Inline spacing="md" className="flex-wrap">
                    <TextLink to="/" variant="primary">Internal Route (React Router)</TextLink>
                    <TextLink href="https://example.com" target="_blank" variant="secondary">External URL</TextLink>
                    <TextLink onClick={() => alert('Clicked!')} variant="subtle">Click Handler</TextLink>
                  </Inline>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-2">Link Sizes:</Text>
                  <Inline spacing="md" className="flex-wrap">
                    <TextLink to="/" variant="primary" size="sm">Small Link</TextLink>
                    <TextLink to="/" variant="primary" size="md">Medium Link</TextLink>
                    <TextLink to="/" variant="primary" size="lg">Large Link</TextLink>
                  </Inline>
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
        </section>

        {/* Typography & Text Shadows Section */}
        <section id="text-shadows">
          <SectionTitle className="mb-8">Text Shadows</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <div className="space-y-8">
            <div>
              <SubSectionTitle className="mb-4">No Shadows</SubSectionTitle>
              <div className="space-y-6">
                <Title variant="hero" textShadow="none">
                  Hero Title (No Shadow) - New!
                </Title>
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
                <Title variant="hero" textShadow="orange">
                  Hero Title - Orange Shadow (New!)
                </Title>
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
                <Title variant="hero" textShadow="dark">
                  Hero Title - Dark Shadow (New!)
                </Title>
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
                <Title variant="hero" textShadow="orange-dark">
                  Hero Title - Orange + Dark Double (New!)
                </Title>
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
                <Title variant="hero" textShadow="dark-orange">
                  Hero Title - Dark + Orange Double (New!)
                </Title>
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
        </section>

        {/* Form Components Section */}
        <section id="forms">
          <SectionTitle className="mb-8">Form Components</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <Grid columns={3} spacing="lg">
            <div>
              <SubSectionTitle className="mb-4">Text Input</SubSectionTitle>
              <TextInput 
                label="Email Address" 
                type="email" 
                placeholder="Enter your email"
                className="mb-4"
              />
              <TextInput 
                label="Password" 
                type="password" 
                placeholder="Enter password"
                className="mb-4"
              />
              <TextInput 
                label="Error State" 
                type="text" 
                error="This field is required"
                className="mb-4"
              />

              <SubSectionTitle className="mb-4">Input Sizes</SubSectionTitle>
              <TextInput 
                label="Extra Small" 
                type="text" 
                size="xs"
                placeholder="xs"
                className="mb-3"
              />
              <TextInput 
                label="Small" 
                type="text" 
                size="sm"
                placeholder="sm"
                className="mb-3"
              />
              <TextInput 
                label="Medium" 
                type="text" 
                size="md"
                placeholder="md"
                className="mb-3"
              />
              <TextInput 
                label="Large" 
                type="text" 
                size="lg"
                placeholder="lg"
                className="mb-3"
              />
              <TextInput 
                label="Extra Large" 
                type="text" 
                size="xl"
                placeholder="xl"
                className="mb-4"
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
                size="lg"
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <div>
              <SubSectionTitle className="mb-4">Text Area</SubSectionTitle>
              <TextArea 
                label="Description"
                placeholder="Tell us about your household..."
                rows={4}
                className="mb-4"
              />
              <TextArea 
                label="Large Text Area"
                size="lg"
                placeholder="Larger text area"
                rows={6}
                className="mb-4"
              />

              <SubSectionTitle className="mb-4">TextArea Sizes</SubSectionTitle>
              <TextArea 
                label="Extra Small"
                size="xs"
                placeholder="xs"
                rows={2}
                className="mb-3"
              />
              <TextArea 
                label="Small"
                size="sm"
                placeholder="sm"
                rows={3}
                className="mb-3"
              />
              <TextArea 
                label="Medium"
                size="md"
                placeholder="md"
                rows={4}
                className="mb-3"
              />
              <TextArea 
                label="Large"
                size="lg"
                placeholder="lg"
                rows={5}
                className="mb-3"
              />
              <TextArea 
                label="Extra Large"
                size="xl"
                placeholder="xl"
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

            <div>
              <SubSectionTitle className="mb-4">Select Components</SubSectionTitle>
              <Select 
                label="Country" 
                placeholder="Choose your country"
                className="mb-4"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
                <Option value="uk">United Kingdom</Option>
                <Option value="au">Australia</Option>
              </Select>
              <Select 
                label="Priority Level" 
                size="lg"
                placeholder="Select priority"
                className="mb-4"
              >
                <Option value="low">Low Priority</Option>
                <Option value="medium">Medium Priority</Option>
                <Option value="high">High Priority</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
              <Select 
                label="Error State" 
                error="Please select a category"
                className="mb-4"
              >
                <Option value="hvac">HVAC Systems</Option>
                <Option value="plumbing">Plumbing</Option>
                <Option value="electrical">Electrical</Option>
              </Select>

              <SubSectionTitle className="mb-4">Select Sizes</SubSectionTitle>
              <Select 
                label="Extra Small" 
                size="xs"
                placeholder="xs"
                className="mb-3"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
              </Select>
              <Select 
                label="Small" 
                size="sm"
                placeholder="sm"
                className="mb-3"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
              </Select>
              <Select 
                label="Medium" 
                size="md"
                placeholder="md"
                className="mb-3"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
              </Select>
              <Select 
                label="Large" 
                size="lg"
                placeholder="lg"
                className="mb-3"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
              </Select>
              <Select 
                label="Extra Large" 
                size="xl"
                placeholder="xl"
                className="mb-4"
              >
                <Option value="us">United States</Option>
                <Option value="ca">Canada</Option>
              </Select>

              <SubSectionTitle className="mb-4">Select Variants</SubSectionTitle>
              <Select 
                label="Default Variant" 
                variant="default"
                placeholder="Light theme"
                className="mb-3"
              >
                <Option value="hvac">HVAC</Option>
                <Option value="plumbing">Plumbing</Option>
              </Select>
              <Select 
                label="Search Variant" 
                variant="search"
                placeholder="Dark theme"
                className="mb-4"
              >
                <Option value="hvac">HVAC</Option>
                <Option value="plumbing">Plumbing</Option>
              </Select>
            </div>
          </Grid>

          <SubSectionTitle className="mb-4 mt-8">Checkboxes</SubSectionTitle>
          <Grid columns={4} spacing="lg">
            <div>
              <Text variant="label" weight="bold" className="block mb-3">Sizes</Text>
              <div className="space-y-3">
                <CheckBox label="Extra Small" size="xs" />
                <CheckBox label="Small" size="sm" />
                <CheckBox label="Medium" size="md" />
                <CheckBox label="Large" size="lg" />
                <CheckBox label="Extra Large" size="xl" />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-3">Colors</Text>
              <div className="space-y-3">
                <CheckBox label="Accent" color="accent" />
                <CheckBox label="Primary" color="primary" />
                <CheckBox label="Secondary" color="secondary" />
                <CheckBox label="Success" color="success" />
                <CheckBox label="Warning" color="warning" />
                <CheckBox label="Error" color="error" />
                <CheckBox label="Dark" color="dark" />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-3">States</Text>
              <div className="space-y-3">
                <CheckBox label="Unchecked" />
                <CheckBox label="Checked" defaultChecked />
                <CheckBox label="Disabled" disabled />
                <CheckBox label="Disabled Checked" checked disabled />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-3">Examples</Text>
              <div className="space-y-3">
                <CheckBox label="Enable notifications" defaultChecked />
                <CheckBox label="Auto-save changes" defaultChecked />
                <CheckBox label="Dark mode" />
                <CheckBox label="Beta features" />
              </div>
            </div>
          </Grid>
        </Card>
        </section>

        {/* Tabs Section */}
        <section id="tabs">
          <SectionTitle className="mb-8">Tabs</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Basic Tabs</SubSectionTitle>
          <Tabs defaultTab="household">
            <Tabs.List className="mb-6">
              <Tabs.Button value="household">Household Settings</Tabs.Button>
              <Tabs.Button value="members">Members</Tabs.Button>
              <Tabs.Button value="notifications">Notifications</Tabs.Button>
            </Tabs.List>
            <Tabs.Panel value="household" className="p-4 border-2 border-text-primary">
              <Text variant="body" className="mb-4">
                Configure your household preferences and general settings.
              </Text>
              <TextInput 
                label="Household Name" 
                type="text"
                placeholder="Enter household name"
                className="mb-4"
              />
              <Select label="Time Zone" className="mb-4">
                <Option value="pst">Pacific Time</Option>
                <Option value="mst">Mountain Time</Option>
                <Option value="cst">Central Time</Option>
                <Option value="est">Eastern Time</Option>
              </Select>
              <CheckBox label="Enable automatic maintenance reminders" />
            </Tabs.Panel>
            <Tabs.Panel value="members" className="p-4 border-2 border-text-primary">
              <Text variant="body" className="mb-4">
                Manage household members and their permissions.
              </Text>
              <div className="space-y-4">
                <SimpleListItem
                  title="John Smith (Admin)"
                  subtitle="john@example.com • Joined 2 months ago"
                  status="completed"
                >
                  <Action variant="outline">Edit Permissions</Action>
                </SimpleListItem>
                <SimpleListItem
                  title="Sarah Smith"
                  subtitle="sarah@example.com • Joined 1 month ago"
                >
                  <Action variant="primary">Manage</Action>
                  <Action variant="outline">Remove</Action>
                </SimpleListItem>
              </div>
              <Button variant="primary" className="mt-4">
                Invite New Member
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="notifications" className="p-4 border-2 border-text-primary">
              <Text variant="body" className="mb-4">
                Configure how and when you receive notifications.
              </Text>
              <div className="space-y-4">
                <CheckBox label="Email notifications for overdue tasks" defaultChecked />
                <CheckBox label="Push notifications on mobile" defaultChecked />
                <CheckBox label="Weekly maintenance summaries" />
                <CheckBox label="Emergency alerts" defaultChecked />
              </div>
              <Select label="Notification Frequency" className="mt-4">
                <Option value="immediate">Immediate</Option>
                <Option value="hourly">Hourly Digest</Option>
                <Option value="daily">Daily Digest</Option>
                <Option value="weekly">Weekly Summary</Option>
              </Select>
            </Tabs.Panel>
          </Tabs>

          <SubSectionTitle className="mb-6 mt-8">Size Variants</SubSectionTitle>
          <Grid columns={2} spacing="lg">
            <div>
              <Text variant="label" weight="bold" className="block mb-2">Extra Small</Text>
              <Tabs defaultTab="settings">
                <Tabs.List size="xs" className="mb-4">
                  <Tabs.Button value="settings" size="xs">Settings</Tabs.Button>
                  <Tabs.Button value="users" size="xs">Users</Tabs.Button>
                  <Tabs.Button value="billing" size="xs">Billing</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="settings" className="p-3 bg-subtle border-2 border-text-primary">
                  <Text variant="body" size="sm">Compact settings panel</Text>
                </Tabs.Panel>
                <Tabs.Panel value="users" className="p-3 bg-subtle border-2 border-text-primary">
                  <Text variant="body" size="sm">User management</Text>
                </Tabs.Panel>
                <Tabs.Panel value="billing" className="p-3 bg-subtle border-2 border-text-primary">
                  <Text variant="body" size="sm">Billing details</Text>
                </Tabs.Panel>
              </Tabs>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-2">Large</Text>
              <Tabs defaultTab="overview">
                <Tabs.List size="lg" className="mb-4">
                  <Tabs.Button value="overview" size="lg">Overview</Tabs.Button>
                  <Tabs.Button value="analytics" size="lg">Analytics</Tabs.Button>
                  <Tabs.Button value="reports" size="lg">Reports</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="overview" className="p-6 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Overview dashboard</Text>
                </Tabs.Panel>
                <Tabs.Panel value="analytics" className="p-6 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Analytics data</Text>
                </Tabs.Panel>
                <Tabs.Panel value="reports" className="p-6 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Reports section</Text>
                </Tabs.Panel>
              </Tabs>
            </div>
          </Grid>

          <SubSectionTitle className="mb-6 mt-8">Tab Variants</SubSectionTitle>
          <Grid columns={3} spacing="lg">
            <div>
              <Text variant="label" weight="bold" className="block mb-2">Primary</Text>
              <Tabs defaultTab="main">
                <Tabs.List className="mb-4">
                  <Tabs.Button value="main" variant="primary">Main</Tabs.Button>
                  <Tabs.Button value="secondary" variant="primary">Secondary</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="main" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Primary content</Text>
                </Tabs.Panel>
                <Tabs.Panel value="secondary" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Secondary content</Text>
                </Tabs.Panel>
              </Tabs>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-2">Secondary</Text>
              <Tabs defaultTab="support">
                <Tabs.List className="mb-4">
                  <Tabs.Button value="support" variant="secondary">Support</Tabs.Button>
                  <Tabs.Button value="docs" variant="secondary">Documentation</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="support" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Support content</Text>
                </Tabs.Panel>
                <Tabs.Panel value="docs" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Documentation</Text>
                </Tabs.Panel>
              </Tabs>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-2">Outline</Text>
              <Tabs defaultTab="filters">
                <Tabs.List className="mb-4">
                  <Tabs.Button value="filters" variant="outline">Filters</Tabs.Button>
                  <Tabs.Button value="search" variant="outline">Search</Tabs.Button>
                </Tabs.List>
                <Tabs.Panel value="filters" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Filter options</Text>
                </Tabs.Panel>
                <Tabs.Panel value="search" className="p-4 bg-subtle border-2 border-text-primary">
                  <Text variant="body">Search results</Text>
                </Tabs.Panel>
              </Tabs>
            </div>
          </Grid>
        </Card>
        </section>

        {/* Steps Section */}
        <section id="steps">
          <SectionTitle className="mb-8">Steps</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Progress Steps Component</SubSectionTitle>
          <Text variant="body" className="mb-6">
            Progress steps show a multi-step process with numbered indicators and connecting lines. 
            Perfect for forms, onboarding, or task workflows. Automatically handles positioning and status styling.
          </Text>

          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Task Creation Workflow:</Text>
              <Steps>
                <Step completed>Task Info</Step>
                <Step active>Equipment</Step>
                <Step>Schedule</Step>
                <Step>Notifications</Step>
              </Steps>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Onboarding Process:</Text>
              <Steps>
                <Step completed>Create Account</Step>
                <Step completed>Verify Email</Step>
                <Step active>Set Up Profile</Step>
                <Step>Join Household</Step>
                <Step>Complete Setup</Step>
              </Steps>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Error State Example:</Text>
              <Steps>
                <Step completed>Validate Data</Step>
                <Step error>Process Payment</Step>
                <Step>Send Confirmation</Step>
              </Steps>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Simple Two-Step Process:</Text>
              <Steps>
                <Step completed>Login</Step>
                <Step active>Dashboard</Step>
              </Steps>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">All Completed:</Text>
              <Steps>
                <Step completed>Setup</Step>
                <Step completed>Configuration</Step>
                <Step completed>Testing</Step>
                <Step completed>Launch</Step>
              </Steps>
            </div>
          </div>

          <SubSectionTitle className="mb-6 mt-8">Vertical Orientation</SubSectionTitle>
          <Text variant="body" className="mb-6">
            Perfect for sidebars, mobile interfaces, or detailed workflows. The vertical layout places 
            indicators and labels side-by-side with connecting lines running vertically.
          </Text>

          <Grid columns={2} spacing="lg">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Navigation Sidebar:</Text>
              <Steps orientation="vertical">
                <Step completed>Dashboard</Step>
                <Step completed>Profile Setup</Step>
                <Step active>Security Settings</Step>
                <Step>Preferences</Step>
                <Step>Help & Support</Step>
              </Steps>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Installation Progress:</Text>
              <Steps orientation="vertical">
                <Step completed>Download</Step>
                <Step completed>Install Dependencies</Step>
                <Step completed>Configure Database</Step>
                <Step error>Start Services</Step>
                <Step>Run Tests</Step>
                <Step>Deploy</Step>
              </Steps>
            </div>
          </Grid>

          <div className="mt-8">
            <Text variant="label" weight="bold" className="block mb-4">Mobile Onboarding Flow:</Text>
            <div className="max-w-sm mx-auto">
              <Steps orientation="vertical">
                <Step completed>Welcome</Step>
                <Step completed>Create Account</Step>
                <Step active>Verify Phone</Step>
                <Step>Set Preferences</Step>
                <Step>Start Using App</Step>
              </Steps>
            </div>
          </div>
        </Card>
        </section>

        {/* Progress Components Section */}
        <section id="progress">
          <SectionTitle className="mb-8">Progress Components</SectionTitle>
        
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Progress Bars</SubSectionTitle>
          <Text variant="body" className="mb-6">
            Progress bars provide visual feedback for task completion, file uploads, and system status. 
            Based on design mockup specifications with 8px height standard and brutal styling.
          </Text>

          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Basic Progress Bars:</Text>
              <div className="space-y-4">
                <ProgressBar value={25} label="Getting Started" />
                <ProgressBar value={50} label="In Progress" variant="secondary" />
                <ProgressBar value={75} label="Almost Done" variant="accent" />
                <ProgressBar value={100} label="Complete" variant="success" />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">With Percentage Display:</Text>
              <div className="space-y-4">
                <ProgressBar value={35} showPercentage variant="primary" />
                <ProgressBar value={68} showPercentage variant="secondary" />
                <ProgressBar value={90} showPercentage variant="accent" />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Equipment Status (Mockup Style):</Text>
              <div className="space-y-4">
                <ProgressBar value={25} label="HVAC Filter - Overdue" variant="error" showPercentage />
                <ProgressBar value={65} label="Water Heater - Due Soon" variant="warning" showPercentage />
                <ProgressBar value={85} label="Dishwasher - On Track" variant="success" showPercentage />
                <ProgressBar value={100} label="Pool Pump - Complete" variant="accent" showPercentage />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Size Variants:</Text>
              <div className="space-y-4">
                <ProgressBar value={70} label="Extra Small" size="xs" variant="primary" />
                <ProgressBar value={70} label="Small" size="sm" variant="secondary" />
                <ProgressBar value={70} label="Medium (Standard)" size="md" variant="accent" />
                <ProgressBar value={70} label="Large" size="lg" variant="primary" />
                <ProgressBar value={70} label="Extra Large" size="xl" variant="secondary" />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">File Upload Progress:</Text>
              <div className="space-y-4">
                <ProgressBar value={0} label="manual_hvac_filter.pdf - Preparing..." variant="secondary" />
                <ProgressBar value={45} label="dishwasher_manual.pdf - Uploading..." variant="primary" showPercentage />
                <ProgressBar value={100} label="pool_maintenance.pdf - Complete!" variant="success" showPercentage />
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Custom Max Values:</Text>
              <div className="space-y-4">
                <ProgressBar value={3} max={5} label="Task 3 of 5 Complete" showPercentage variant="accent" />
                <ProgressBar value={750} max={1000} label="750 of 1000 Points" showPercentage variant="primary" />
                <ProgressBar value={8} max={12} label="8 of 12 Months" showPercentage variant="secondary" />
              </div>
            </div>
          </div>
        </Card>
        </section>

        {/* Choice Section */}
        <section id="choices">
          <SectionTitle className="mb-8">Choice Components</SectionTitle>
        
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Default Choice</SubSectionTitle>
          
          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Category Selection:</Text>
              <DefaultChoice name="category" value={category} onChange={handleCategoryChange}>
                <Option value="cleaning">Cleaning</Option>
                <Option value="maintenance">Maintenance</Option>
                <Option value="shopping">Shopping</Option>
                <Option value="repairs">Repairs</Option>
              </DefaultChoice>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Multiple Selection:</Text>
              <DefaultChoice name="tags" multiple value={filters} onChange={handleFiltersChange}>
                <Option value="urgent">Urgent</Option>
                <Option value="easy">Easy Task</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </DefaultChoice>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Vertical Layout:</Text>
              <DefaultChoice name="settings" orientation="vertical">
                <Option value="notifications">Enable Notifications</Option>
                <Option value="reminders">Daily Reminders</Option>
                <Option value="sharing">Share Progress</Option>
              </DefaultChoice>
            </div>
          </div>
        </Card>

        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Priority Choice</SubSectionTitle>
          
          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Task Priority:</Text>
              <PriorityChoice name="priority" value={priority} onChange={handlePriorityChange}>
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </PriorityChoice>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Issue Severity:</Text>
              <PriorityChoice name="severity">
                <Option value="low">Minor</Option>
                <Option value="medium">Major</Option>
                <Option value="high">Critical</Option>
              </PriorityChoice>
            </div>
          </div>
        </Card>

        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Filter Choice</SubSectionTitle>
          
          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Status Filters:</Text>
              <FilterChoice name="statusFilters" multiple>
                <Option value="all">All</Option>
                <Option value="overdue">Overdue</Option>
                <Option value="due-soon">Due Soon</Option>
                <Option value="upcoming">Upcoming</Option>
                <Option value="completed">Completed</Option>
              </FilterChoice>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Category Filters:</Text>
              <FilterChoice name="categoryFilters" multiple>
                <Option value="cleaning">Cleaning</Option>
                <Option value="maintenance">Maintenance</Option>
                <Option value="shopping">Shopping</Option>
                <Option value="repairs">Repairs</Option>
              </FilterChoice>
            </div>
          </div>
        </Card>

        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Icon Choice</SubSectionTitle>
          
          <div className="space-y-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-4">Frequency Selection:</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <IconChoice name="frequency" value={frequency} onChange={handleFrequencyChange}>
                  <Option value="once">One Time</Option>
                  <Option value="recurring">Recurring</Option>
                  <Option value="usage">Based on Usage</Option>
                  <Option value="condition">Condition Based</Option>
                </IconChoice>
              </div>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-4">Time Periods:</Text>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <IconChoice name="timeframe">
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="yearly">Yearly</Option>
                </IconChoice>
              </div>
            </div>
          </div>
        </Card>
        </section>

        {/* Alert Section */}
        <section id="alerts">
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
            <Alert variant="info" size="xs">Extra small alert</Alert>
            <Alert variant="success" size="sm">Small alert</Alert>
            <Alert variant="warning" size="md">Medium alert</Alert>
            <Alert variant="error" size="lg">Large alert</Alert>
            <Alert variant="basic" size="xl">Extra large alert</Alert>
          </div>
        </Card>
        </section>

        {/* Variation Components Section */}
        <section id="variations">
          <SectionTitle className="mb-8">Variation Components</SectionTitle>
        
        {/* Option Cards */}
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <SubSectionTitle className="mb-6">Option Cards</SubSectionTitle>
          <Grid columns={2} spacing="lg" className="mb-8">
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
          </Grid>

          <SubSectionTitle className="mb-6">Stat Cards</SubSectionTitle>
          <Grid columns={3} spacing="lg" className="mb-8">
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
          </Grid>

          <SubSectionTitle className="mb-6">Task Cards</SubSectionTitle>
          <Grid columns={2} spacing="lg">
            <TaskCard
              title="HVAC Filter Change"
              subtitle="Central Air System • 3rd Floor"
              status="urgent"
              dueDate="Due Tomorrow"
            >
              <Action variant="danger" onClick={() => alert('Marked complete')}>
                Mark Complete
              </Action>
              <Action variant="outline" onClick={() => alert('Reschedule clicked')}>
                Reschedule
              </Action>
            </TaskCard>
            <TaskCard
              title="Dishwasher Deep Clean"
              subtitle="Kitchen • Monthly maintenance"
              status="completed"
              dueDate="Completed Yesterday"
            >
              <Action variant="accent" onClick={() => alert('View report')}>
                View Report
              </Action>
              <Action variant="outline" onClick={() => alert('Schedule next')}>
                Schedule Next
              </Action>
              <Action variant="outline" onClick={() => alert('View photos')}>
                View Photos
              </Action>
            </TaskCard>
            <TaskCard
              title="Pool Chemical Check"
              subtitle="Backyard Pool • Weekly task"
              status="normal"
              dueDate="Due in 3 Days"
            >
              <Action variant="secondary" onClick={() => alert('Mark complete')}>
                Mark Complete
              </Action>
              <Action variant="outline" onClick={() => alert('View details')}>
                Details
              </Action>
            </TaskCard>
            <TaskCard
              title="Emergency Repair"
              subtitle="Water heater replacement"
              status="completed"
              dueDate="Completed Last Week"
            >
              <Action variant="accent" onClick={() => alert('View invoice')}>
                View Invoice
              </Action>
              <Action variant="outline" onClick={() => alert('Warranty info')}>
                Warranty Info
              </Action>
              <Action variant="outline" onClick={() => alert('Contact service')}>
                Contact Service
              </Action>
              <Action variant="outline" onClick={() => alert('Schedule follow-up')}>
                Schedule Follow-up
              </Action>
            </TaskCard>
          </Grid>
        </Card>
        </section>

        {/* List Items Section */}
        <section id="list-items">
          <SectionTitle className="mb-8">List Items</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <div className="space-y-4">
            <SimpleListItem
              title="Review House Rules"
              subtitle="Last updated 2 days ago"
            >
              <Action variant="primary" onClick={() => alert('Edit clicked')}>Edit</Action>
            </SimpleListItem>
            <SimpleListItem
              title="Complete Monthly Budget"
              subtitle="Due in 3 days"
              status="urgent"
            >
              <Action variant="danger" onClick={() => alert('Complete clicked')}>Complete Now</Action>
              <Action variant="outline" onClick={() => alert('Postpone clicked')}>Postpone</Action>
            </SimpleListItem>
            <SimpleListItem
              title="Schedule Maintenance"
              subtitle="HVAC check completed"
              status="completed"
            >
              <Action variant="outline" onClick={() => alert('View details clicked')}>View Details</Action>
            </SimpleListItem>
            <SimpleListItem
              title="Update Emergency Contacts"
              subtitle="Requires attention"
              status="info"
              hover
              onClick={() => alert('List item clicked')}
            />
          </div>
        </Card>
        </section>

        {/* New List Items Section */}
        <section id="new-list-items">
          <SectionTitle className="mb-8">New List Items (Compound Components)</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <Text variant="body" className="mb-6">
            NewListItem uses the compound component pattern for flexible layouts. It conditionally renders 
            avatar, badges, and actions based on which compound components are provided as children.
          </Text>

          <SubSectionTitle className="mb-6">Basic Usage</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <ListItem title="Simple Task" subtitle="Basic description">
              <ListItem.Actions>
                <Action variant="primary">Complete</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Task with Badge" subtitle="Shows status indicator">
              <ListItem.Badge variant="primary">In Progress</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Continue</Action>
                <Action variant="outline">Pause</Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">Member List Examples</SubSectionTitle>
          <div className="space-y-4 mb-8">
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
          </div>

          <SubSectionTitle className="mb-6">Task/Equipment Examples</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <ListItem title="HVAC Filter Change" subtitle="Carrier Air Handler • Basement" status="urgent">
              <ListItem.Avatar color="secondary">🔥</ListItem.Avatar>
              <ListItem.Badge variant="danger">5 Days Overdue</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Mark Complete</Action>
                <Action variant="outline">Reschedule</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Pool Chemical Test" subtitle="Backyard Pool • Weekly maintenance" status="info">
              <ListItem.Avatar color="accent">🏊</ListItem.Avatar>
              <ListItem.Badge variant="secondary">Weekly</ListItem.Badge>
              <ListItem.Badge variant="accent">Due Soon</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Complete</Action>
                <Action variant="outline">View History</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Dishwasher Deep Clean" subtitle="Kitchen • Monthly task" status="completed">
              <ListItem.Avatar color="primary">🍽️</ListItem.Avatar>
              <ListItem.Badge variant="success">Completed</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="outline">View Report</Action>
                <Action variant="outline">Schedule Next</Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">Notification Examples</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <ListItem title="Task Reminder" subtitle="HVAC filter change is overdue" status="urgent">
              <ListItem.Avatar color="danger">⚠️</ListItem.Avatar>
              <ListItem.Badge variant="danger">Urgent</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">View Task</Action>
                <Action variant="outline">Dismiss</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="New Member Joined" subtitle="Sarah Johnson joined your household" status="completed">
              <ListItem.Avatar color="accent">👋</ListItem.Avatar>
              <ListItem.Badge variant="success">New</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Welcome</Action>
                <Action variant="outline">View Profile</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="System Update" subtitle="HomeKeeper v2.1 is now available" status="info">
              <ListItem.Avatar color="primary">🔄</ListItem.Avatar>
              <ListItem.Badge variant="primary">Update</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Update Now</Action>
                <Action variant="outline">Learn More</Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">History/Activity Examples</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <ListItem title="Task Completed" subtitle="Pool chemical test • 2 hours ago">
              <ListItem.Avatar color="accent">✅</ListItem.Avatar>
              <ListItem.Badge variant="success">Completed</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="outline">View Details</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Manual Uploaded" subtitle="Samsung refrigerator manual • Yesterday">
              <ListItem.Avatar color="primary">📄</ListItem.Avatar>
              <ListItem.Badge variant="secondary">PDF</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">View Manual</Action>
                <Action variant="outline">Share</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Member Activity" subtitle="John Smith updated 3 tasks • 3 days ago">
              <ListItem.Avatar color="secondary">👤</ListItem.Avatar>
              <ListItem.Badge variant="accent">Batch Update</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="outline">View Changes</Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">Status Variants</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <ListItem title="Default Status" subtitle="No special border styling">
              <ListItem.Avatar color="default">📋</ListItem.Avatar>
              <ListItem.Actions>
                <Action variant="outline">View</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Urgent Status" subtitle="Red left border for high priority" status="urgent">
              <ListItem.Avatar color="danger">🚨</ListItem.Avatar>
              <ListItem.Badge variant="danger">Urgent</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Handle Now</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Completed Status" subtitle="Green left border for finished items" status="completed">
              <ListItem.Avatar color="accent">✅</ListItem.Avatar>
              <ListItem.Badge variant="success">Done</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="outline">View Report</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Info Status" subtitle="Blue left border for informational items" status="info">
              <ListItem.Avatar color="secondary">ℹ️</ListItem.Avatar>
              <ListItem.Badge variant="secondary">Info</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="outline">Learn More</Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">Interactive Examples</SubSectionTitle>
          <div className="space-y-4">
            <ListItem 
              title="Clickable Item" 
              subtitle="Entire item is clickable with hover effects"
              hover
              onClick={() => alert('NewListItem clicked!')}
            >
              <ListItem.Avatar color="primary">🖱️</ListItem.Avatar>
              <ListItem.Badge variant="primary">Interactive</ListItem.Badge>
            </ListItem>

            <ListItem 
              title="Mixed Interactions" 
              subtitle="Item click + individual actions"
              onClick={() => alert('Item background clicked!')}
            >
              <ListItem.Avatar color="secondary">🎯</ListItem.Avatar>
              <ListItem.Badge variant="secondary">Mixed</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary" onClick={(e) => { e.stopPropagation(); alert('Action clicked!'); }}>
                  Action Button
                </Action>
              </ListItem.Actions>
            </ListItem>
          </div>

          <SubSectionTitle className="mb-6">Shadow Control Examples</SubSectionTitle>
          <Text variant="body" size="sm" className="mb-4">
            Buttons automatically size their shadows based on button size. Use shadow=false for cleaner list layouts.
          </Text>
          <div className="space-y-4">
            <ListItem title="Default Shadows" subtitle="Standard button shadows based on size">
              <ListItem.Avatar color="primary">⚡</ListItem.Avatar>
              <ListItem.Badge variant="secondary">Default</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary">Primary (sm shadow)</Action>
                <Action variant="outline">Outline (no shadow)</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="No Shadows" subtitle="Cleaner appearance for list contexts">
              <ListItem.Avatar color="secondary">🎯</ListItem.Avatar>
              <ListItem.Badge variant="primary">No Shadow</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary" shadow={false}>Primary (no shadow)</Action>
                <Action variant="secondary" shadow={false}>Secondary (no shadow)</Action>
                <Action variant="outline">Outline (already no shadow)</Action>
              </ListItem.Actions>
            </ListItem>

            <ListItem title="Mixed Shadow Usage" subtitle="Demonstrating selective shadow control">
              <ListItem.Avatar color="accent">🔀</ListItem.Avatar>
              <ListItem.Badge variant="accent">Mixed</ListItem.Badge>
              <ListItem.Actions>
                <Action variant="primary" shadow={false}>No Shadow</Action>
                <Action variant="secondary">With Shadow</Action>
                <Action variant="outline">Natural (no shadow)</Action>
              </ListItem.Actions>
            </ListItem>
          </div>
        </Card>
        </section>

        {/* Media Cards Section */}
        <section id="media-cards">
          <SectionTitle className="mb-8">Media Cards (Compound Components)</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <Text variant="body" className="mb-6">
            MediaCard uses compound components for flexible card layouts. Designed as a container 
            for other interactive elements rather than being interactive itself. Perfect for grid displays.
          </Text>

          <SubSectionTitle className="mb-6">Manual Cards</SubSectionTitle>
          <Grid columns={3} spacing="lg" className="mb-8">
            <MediaCard title="Samsung Refrigerator" subtitle="Model: RF28T5001SR" variant="default">
              <MediaCard.Badge variant="secondary">Kitchen</MediaCard.Badge>
              <p className="text-sm mb-4">30-page manual covering installation, operation, and maintenance procedures.</p>
              <Button variant="primary" size="sm">View Manual</Button>
            </MediaCard>

            <MediaCard title="Carrier HVAC System" subtitle="Model: 25HCB6 • Basement" variant="primary">
              <MediaCard.Avatar color="secondary">🔥</MediaCard.Avatar>
              <MediaCard.Badge variant="accent">PDF</MediaCard.Badge>
              <p className="text-sm mb-4 text-white">Installation and service manual for central air conditioning unit.</p>
              <Button variant="outline" size="sm">Download PDF</Button>
            </MediaCard>

            <MediaCard title="Pool Pump Manual" subtitle="Hayward Super Pump" variant="accent" rotation="slight-left">
              <MediaCard.Avatar color="primary">🏊</MediaCard.Avatar>
              <MediaCard.Badge variant="primary">Maintenance</MediaCard.Badge>
              <p className="text-sm mb-4 text-white">Complete guide for pool pump operation and troubleshooting.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="outline" size="sm">Share</Button>
              </div>
            </MediaCard>
          </Grid>

          <SubSectionTitle className="mb-6">Equipment Display Cards</SubSectionTitle>
          <Grid columns={2} spacing="lg" className="mb-8">
            <MediaCard title="HVAC System Status" subtitle="Carrier FV4CNF006 • Basement" variant="secondary" shadow="primary">
              <MediaCard.Avatar color="accent">🔥</MediaCard.Avatar>
              <MediaCard.Badge variant="success">Healthy</MediaCard.Badge>
              <div className="space-y-3">
                <div className="text-white">
                  <p className="text-sm font-bold">Last Maintenance: 3 months ago</p>
                  <p className="text-sm">Next Service: Due in 2 months</p>
                  <p className="text-sm">Filter Status: Good</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Schedule Service</Button>
                  <Button variant="outline" size="sm">View History</Button>
                </div>
              </div>
            </MediaCard>

            <MediaCard title="Pool Equipment" subtitle="Hayward System • Backyard" variant="dark" rotation="slight-right">
              <MediaCard.Avatar color="secondary">🏊</MediaCard.Avatar>
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
          </Grid>

          <SubSectionTitle className="mb-6">Dashboard Stats Widgets</SubSectionTitle>
          <Grid columns={3} spacing="lg" className="mb-8">
            <MediaCard title="Active Tasks" subtitle="47 total items" variant="primary" rotation="slight-left" shadow="dark">
              <MediaCard.Avatar color="accent">📋</MediaCard.Avatar>
              <div className="text-center text-white">
                <div className="text-4xl font-black mb-2">47</div>
                <p className="text-sm">12 overdue • 35 upcoming</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">View All Tasks</Button>
            </MediaCard>

            <MediaCard title="Completed This Month" subtitle="Progress tracking" variant="accent" shadow="primary">
              <MediaCard.Avatar color="primary">✅</MediaCard.Avatar>
              <div className="text-center text-white">
                <div className="text-4xl font-black mb-2">23</div>
                <p className="text-sm">↑ 15% from last month</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">View Report</Button>
            </MediaCard>

            <MediaCard title="Equipment Health" subtitle="Overall system status" variant="secondary" rotation="slight-right">
              <MediaCard.Avatar color="accent">⚙️</MediaCard.Avatar>
              <MediaCard.Badge variant="success">Good</MediaCard.Badge>
              <div className="text-center text-white">
                <div className="text-4xl font-black mb-2">94%</div>
                <p className="text-sm">2 items need attention</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">View Details</Button>
            </MediaCard>
          </Grid>

          <SubSectionTitle className="mb-6">Variant Showcase</SubSectionTitle>
          <Grid columns={3} spacing="lg" className="mb-8">
            <MediaCard title="Default Variant" subtitle="Light background" variant="default">
              <MediaCard.Badge variant="secondary">Standard</MediaCard.Badge>
              <p className="text-sm mb-4">Clean, minimal appearance for general content.</p>
            </MediaCard>

            <MediaCard title="Primary Variant" subtitle="Brand orange" variant="primary">
              <MediaCard.Badge variant="accent">Featured</MediaCard.Badge>
              <p className="text-sm mb-4 text-white">Eye-catching orange background for important content.</p>
            </MediaCard>

            <MediaCard title="Danger Variant" subtitle="Alert styling" variant="danger">
              <MediaCard.Badge variant="secondary">Alert</MediaCard.Badge>
              <p className="text-sm mb-4 text-white">Red background for warnings and critical information.</p>
            </MediaCard>
          </Grid>

          <SubSectionTitle className="mb-6">Rotation & Shadow Effects</SubSectionTitle>
          <Grid columns={4} spacing="lg" className="mb-8">
            <MediaCard title="No Rotation" subtitle="Standard alignment" variant="accent" rotation="none">
              <MediaCard.Avatar color="primary">📐</MediaCard.Avatar>
            </MediaCard>

            <MediaCard title="Slight Left" subtitle="Subtle tilt" variant="primary" rotation="slight-left">
              <MediaCard.Avatar color="accent">↺</MediaCard.Avatar>
            </MediaCard>

            <MediaCard title="Slight Right" subtitle="Gentle angle" variant="secondary" rotation="slight-right">
              <MediaCard.Avatar color="danger">↻</MediaCard.Avatar>
            </MediaCard>

            <MediaCard title="Left Rotation" subtitle="More pronounced" variant="danger" rotation="left">
              <MediaCard.Avatar color="secondary">🔄</MediaCard.Avatar>
            </MediaCard>
          </Grid>

          <SubSectionTitle className="mb-6">Complex Content Examples</SubSectionTitle>
          <Grid columns={2} spacing="lg" className="mb-8">
            <MediaCard title="Task Assignment Card" subtitle="Multi-member collaboration" variant="default" shadow="dark">
              <MediaCard.Badge variant="primary">Team Task</MediaCard.Badge>
              <div className="space-y-3">
                <p className="text-sm">Assigned to: John, Sarah, Mike</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary text-white text-xs font-bold rounded border-2 border-white flex items-center justify-center">J</div>
                  <div className="w-8 h-8 bg-secondary text-white text-xs font-bold rounded border-2 border-white flex items-center justify-center">S</div>
                  <div className="w-8 h-8 bg-accent text-white text-xs font-bold rounded border-2 border-white flex items-center justify-center">M</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">Assign More</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </MediaCard>

            <MediaCard title="Maintenance Schedule" subtitle="Upcoming service dates" variant="secondary" rotation="slight-left">
              <MediaCard.Avatar color="primary">📅</MediaCard.Avatar>
              <MediaCard.Badge variant="accent">Scheduled</MediaCard.Badge>
              <div className="space-y-2 text-white">
                <div className="text-sm">
                  <span className="font-bold">Next:</span> HVAC Filter (Mar 15)
                </div>
                <div className="text-sm">
                  <span className="font-bold">Upcoming:</span> Pool Service (Mar 20)
                </div>
                <div className="text-sm">
                  <span className="font-bold">Later:</span> Appliance Check (Apr 1)
                </div>
                <Button variant="outline" size="sm" className="mt-3">Manage Schedule</Button>
              </div>
            </MediaCard>
          </Grid>

          <SubSectionTitle className="mb-6">Badge Combinations</SubSectionTitle>
          <Grid columns={3} spacing="lg">
            <MediaCard title="Multiple Badges" subtitle="Various status indicators" variant="default">
              <MediaCard.Badge variant="primary">Priority</MediaCard.Badge>
              <MediaCard.Badge variant="secondary">HVAC</MediaCard.Badge>
              <MediaCard.Badge variant="success">Completed</MediaCard.Badge>
              <p className="text-sm mt-3">Cards can display multiple badges that automatically wrap.</p>
            </MediaCard>

            <MediaCard title="Category Tags" subtitle="Organized by type" variant="primary">
              <MediaCard.Badge variant="accent">Kitchen</MediaCard.Badge>
              <MediaCard.Badge variant="secondary">Appliance</MediaCard.Badge>
              <p className="text-sm mt-3 text-white">Use badges to categorize and filter content.</p>
            </MediaCard>

            <MediaCard title="Status Indicators" subtitle="Current state display" variant="accent">
              <MediaCard.Badge variant="danger">Overdue</MediaCard.Badge>
              <MediaCard.Badge variant="primary">High Priority</MediaCard.Badge>
              <p className="text-sm mt-3 text-white">Visual status helps users quickly identify important items.</p>
            </MediaCard>
          </Grid>
        </Card>
        </section>

        {/* Action Component Section */}
        <section id="action-component">
          <SectionTitle className="mb-8">Action Component</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-12">
          <Text variant="body" className="mb-6">
            The Action component is a lightweight wrapper around Button with smart defaults for action contexts.
            It automatically applies size="sm" and provides semantic meaning for action buttons.
          </Text>

          <SubSectionTitle className="mb-4">Action vs Button Comparison</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <div>
              <Text variant="label" weight="bold" className="block mb-2">Action Components (Auto size="sm"):</Text>
              <div className="flex gap-3 mb-4">
                <Action variant="primary" onClick={() => alert('Action clicked')}>Primary Action</Action>
                <Action variant="secondary" onClick={() => alert('Action clicked')}>Secondary Action</Action>
                <Action variant="outline" onClick={() => alert('Action clicked')}>Outline Action</Action>
                <Action variant="danger" onClick={() => alert('Action clicked')}>Danger Action</Action>
              </div>
            </div>
            
            <div>
              <Text variant="label" weight="bold" className="block mb-2">Button Components (Manual size="sm"):</Text>
              <div className="flex gap-3 mb-4">
                <Button variant="primary" size="sm" onClick={() => alert('Button clicked')}>Primary Button</Button>
                <Button variant="secondary" size="sm" onClick={() => alert('Button clicked')}>Secondary Button</Button>
                <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>Outline Button</Button>
                <Button variant="danger" size="sm" onClick={() => alert('Button clicked')}>Danger Button</Button>
              </div>
            </div>
          </div>

          <SubSectionTitle className="mb-4">Action Size Overrides</SubSectionTitle>
          <div className="space-y-4 mb-8">
            <Text variant="body" className="mb-4">
              Action components default to size="sm" but can override when needed:
            </Text>
            <div className="flex gap-3 items-center">
              <Action variant="primary" size="xs" onClick={() => alert('XS Action')}>Extra Small</Action>
              <Action variant="primary" size="sm" onClick={() => alert('SM Action')}>Small (Default)</Action>
              <Action variant="primary" size="md" onClick={() => alert('MD Action')}>Medium</Action>
              <Action variant="primary" size="lg" onClick={() => alert('LG Action')}>Large</Action>
            </div>
          </div>

          <SubSectionTitle className="mb-4">Mixed Usage Patterns</SubSectionTitle>
          <div className="space-y-6">
            <div>
              <Text variant="label" weight="bold" className="block mb-3">TaskCard with mixed Action/Button:</Text>
              <TaskCard
                title="Mixed Action Example"
                subtitle="Demonstrates Action + Button composition"
                status="normal"
                dueDate="Due in 5 days"
              >
                <Action variant="primary" onClick={() => alert('Simple action')}>
                  Complete Task
                </Action>
                <Button variant="outline" size="sm" onClick={() => alert('Complex action')}>
                  📎 Add Attachment
                </Button>
                <Action variant="outline" onClick={() => alert('Another action')}>
                  Reschedule
                </Action>
              </TaskCard>
            </div>

            <div>
              <Text variant="label" weight="bold" className="block mb-3">ListItem with multiple Actions:</Text>
              <SimpleListItem
                title="Multiple Actions Example"
                subtitle="Shows how multiple actions work together"
                status="info"
              >
                <Action variant="primary" onClick={() => alert('Approve')}>Approve</Action>
                <Action variant="danger" onClick={() => alert('Reject')}>Reject</Action>
                <Action variant="outline" onClick={() => alert('Comment')}>Comment</Action>
              </SimpleListItem>
            </div>
          </div>
        </Card>
        </section>

        {/* Background Components */}
        <section id="backgrounds">
          <Title variant="section" className="mb-6">
            Background Components
          </Title>
          
          <Title variant="subsection" className="mb-4">
            Individual Background Patterns
          </Title>
          <Grid columns={2} spacing="lg" className="mb-8">
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
          </Grid>

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
          
        </section>
        </WideContainer>
      </div>
    </div>
  );
}