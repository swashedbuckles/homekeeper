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
import { CheckBox } from '../../components/form/Checkbox';
import { PasswordStrengthIndicator } from '../../components/form/PasswordStrengthIndicator';
import { TextArea } from '../../components/form/TextArea';
import { TextInput } from '../../components/form/TextInput';
import { WideContainer } from '../../components/layout/containers/WideContainer';
import { Inline } from '../../components/layout/Flex';
import { Grid } from '../../components/layout/Grid';

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

// Table of contents navigation component
const TableOfContents = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const sections = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'typography', label: 'Typography' },
    { id: 'text-shadows', label: 'Text Shadows' },
    { id: 'forms', label: 'Form Components' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'variations', label: 'Variation Components' },
    { id: 'list-items', label: 'List Items' },
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

        {/* Typography Section */}
        <section id="typography">
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
        </section>

        {/* Form Components Section */}
        <section id="forms">
          <SectionTitle className="mb-8">Form Components</SectionTitle>
        <Card variant="default" shadow="triple" className="p-8 mb-8">
          <Grid columns={2} spacing="lg">
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
                size="lg"
                placeholder="Enter password"
                className="mb-4"
              />
              <TextInput 
                label="Error State" 
                type="text" 
                error="This field is required"
                className="mb-6"
              />

              <SubSectionTitle className="mb-4">TextInput Sizes (All 5 StandardSize Options)</SubSectionTitle>
              <TextInput 
                label="Extra Small Input" 
                type="text" 
                size="xs"
                placeholder="xs - minimal padding"
                className="mb-3"
              />
              <TextInput 
                label="Small Input" 
                type="text" 
                size="sm"
                placeholder="sm - compact size"
                className="mb-3"
              />
              <TextInput 
                label="Medium Input" 
                type="text" 
                size="md"
                placeholder="md - default size"
                className="mb-3"
              />
              <TextInput 
                label="Large Input" 
                type="text" 
                size="lg"
                placeholder="lg - prominent size"
                className="mb-3"
              />
              <TextInput 
                label="Extra Large Input" 
                type="text" 
                size="xl"
                placeholder="xl - maximum impact"
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
              <SubSectionTitle className="mb-6">Text Area</SubSectionTitle>
              <TextArea 
                label="Description"
                placeholder="Tell us about your household..."
                rows={4}
                className="mb-4"
              />
              <TextArea 
                label="Large Text Area"
                size="lg"
                placeholder="Larger text area example"
                rows={6}
                className="mb-6"
              />

              <SubSectionTitle className="mb-4">TextArea Sizes (All 5 StandardSize Options)</SubSectionTitle>
              <TextArea 
                label="Extra Small TextArea"
                size="xs"
                placeholder="xs - minimal padding, compact text"
                rows={2}
                className="mb-3"
              />
              <TextArea 
                label="Small TextArea"
                size="sm"
                placeholder="sm - compact size"
                rows={3}
                className="mb-3"
              />
              <TextArea 
                label="Medium TextArea"
                size="md"
                placeholder="md - default size"
                rows={4}
                className="mb-3"
              />
              <TextArea 
                label="Large TextArea"
                size="lg"
                placeholder="lg - prominent with larger text"
                rows={5}
                className="mb-3"
              />
              <TextArea 
                label="Extra Large TextArea"
                size="xl"
                placeholder="xl - maximum impact for important forms"
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
              <SubSectionTitle className="mb-6">Checkbox Components</SubSectionTitle>
              
              <div className="space-y-6">
                <div>
                  <Text variant="label" weight="bold" className="block mb-3">Checkbox Sizes:</Text>
                  <div className="space-y-3">
                    <CheckBox label="Extra Small - compact forms" size="xs" />
                    <CheckBox label="Small - minimal interfaces" size="sm" />
                    <CheckBox label="Medium - default size (recommended)" size="md" />
                    <CheckBox label="Large - prominent forms" size="lg" />
                    <CheckBox label="Extra Large - maximum impact" size="xl" />
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">Checkbox Colors:</Text>
                  <div className="space-y-3">
                    <CheckBox label="Accent (Green) - Default" color="accent" />
                    <CheckBox label="Primary (Blue) - Main actions" color="primary" />
                    <CheckBox label="Secondary (Purple) - Alternative" color="secondary" />
                    <CheckBox label="Success (Green) - Confirmations" color="success" />
                    <CheckBox label="Warning (Orange) - Cautions" color="warning" />
                    <CheckBox label="Error (Red) - Destructive actions" color="error" />
                    <CheckBox label="Dark (Black) - High contrast" color="dark" />
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">Disabled State:</Text>
                  <div className="space-y-3">
                    <CheckBox label="Disabled unchecked checkbox" color="accent" disabled />
                    <CheckBox label="Disabled checked checkbox" color="primary" checked disabled />
                    <CheckBox label="Large disabled checkbox" color="success" size="lg" disabled />
                  </div>
                </div>

                <div>
                  <Text variant="label" weight="bold" className="block mb-3">Pre-checked Examples:</Text>
                  <div className="space-y-3">
                    <CheckBox label="HVAC system maintenance enabled" color="accent" defaultChecked />
                    <CheckBox label="Receive mobile push notifications" color="primary" defaultChecked />
                    <CheckBox label="Auto-schedule recurring tasks" color="success" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Grid>
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

          <SubSectionTitle className="mt-8 mb-4">Alert Sizes (All 5 StandardSize Options)</SubSectionTitle>
          <div className="space-y-4">
            <Alert variant="info" size="xs">Extra small alert - minimal spacing and tiny icon</Alert>
            <Alert variant="success" size="sm">Small alert - compact with small icon</Alert>
            <Alert variant="warning" size="md">Medium alert - default size with standard icon</Alert>
            <Alert variant="error" size="lg">Large alert - prominent with larger icon</Alert>
            <Alert variant="basic" size="xl">Extra large alert - maximum impact with biggest icon</Alert>
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
          </Grid>
        </Card>
        </section>

        {/* List Items Section */}
        <section id="list-items">
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
        </WideContainer>
      </div>
    </div>
  );
}