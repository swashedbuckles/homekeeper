import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { Title } from '../../components/common/Title';
import { ContentContainer } from '../../components/layout/containers/ContentContainer';
import { SectionContainer } from '../../components/layout/containers/SectionContainer';
import { Flex, Stack, Inline } from '../../components/layout/Flex';
import { Grid } from '../../components/layout/Grid';
import { TwoColumnLayout } from '../../components/layout/TwoColumnLayout';
import { StatCard } from '../../components/variations/StatCard';
import { SubSectionTitle } from '../../components/variations/SubSectionTitle';

/**
 * Layout Examples Page
 * 
 * Comprehensive demonstration of all layout components:
 * - TwoColumnLayout (sidebar patterns)
 * - Grid (responsive grids, dashboard cards)
 * - Flex (alignment, spacing, distribution)
 * - Stack (vertical layouts)
 * - Inline (horizontal layouts)
 */
export const LayoutExamples = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Layout Overview */}
      <SectionContainer spacing="xl">
        <ContentContainer>
          <Stack spacing="xl">
            <Flex spacing="lg" className="flex-col items-center">
              <Title variant="page">Layout Component Examples</Title>
              <Text size="lg" color="secondary">
                Comprehensive showcase of TwoColumnLayout, Grid, Flex, Stack, and Inline components
              </Text>
            </Flex>

            {/* Quick Navigation */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="md">
                <SubSectionTitle>Component Examples</SubSectionTitle>
                <Inline spacing="sm" className="flex-wrap justify-center">
                  <Button variant="outline" size="sm">Two-Column Layouts</Button>
                  <Button variant="outline" size="sm">Grid Systems</Button>
                  <Button variant="outline" size="sm">Flex Utilities</Button>
                  <Button variant="outline" size="sm">Stack & Inline</Button>
                </Inline>
              </Stack>
            </Card>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Grid Examples Section */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Stack spacing="xl">
            <Title variant="section">Grid System Examples</Title>
            
            {/* Stats Grid */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Responsive Stats Grid (4 columns)</SubSectionTitle>
                <Grid columns={4} spacing="lg">
                  <StatCard label="Total Users" value={1247} variant="primary" size="md" />
                  <StatCard label="Active Sessions" value={89} variant="secondary" size="md" />
                  <StatCard label="Revenue" value="$12.4K" variant="accent" size="md" />
                  <StatCard label="Growth" value="+23%" variant="dark" size="md" />
                </Grid>
              </Stack>
            </Card>

            {/* Auto-fit Grid */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Auto-fit Grid (min 250px)</SubSectionTitle>
                <Grid columns="auto-fit" minWidth="250px" spacing="md">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} padding="md" shadow="primary">
                      <Stack spacing="sm">
                        <Text weight="bold">Card {i + 1}</Text>
                        <Text size="sm" color="secondary">Auto-sizing content that adapts to screen width</Text>
                        <Badge variant="status" color="primary" size="sm">Active</Badge>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>

            {/* Complex Grid with Spans */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Complex Grid Layout (with spans)</SubSectionTitle>
                <Grid columns={4} spacing="lg">
                  <Grid.Item span={2}>
                    <Card padding="lg" shadow="secondary" className="h-full">
                      <Stack spacing="md">
                        <Text weight="bold" size="lg">Main Content (2 columns)</Text>
                        <Text color="secondary">This item spans 2 grid columns and demonstrates how to create hero sections or featured content.</Text>
                        <Button variant="primary">Learn More</Button>
                      </Stack>
                    </Card>
                  </Grid.Item>
                  <Card padding="md" shadow="primary">
                    <Stack spacing="sm">
                      <Text weight="bold">Widget 1</Text>
                      <Text size="sm" color="secondary">Regular grid item</Text>
                    </Stack>
                  </Card>
                  <Card padding="md" shadow="primary">
                    <Stack spacing="sm">
                      <Text weight="bold">Widget 2</Text>
                      <Text size="sm" color="secondary">Regular grid item</Text>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Flex Examples Section */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Stack spacing="xl">
            <Title variant="section">Flex Utility Examples</Title>

            {/* Simplified Flex Examples */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Simplified Flex - Spacing + Tailwind</SubSectionTitle>
                
                <Stack spacing="md">
                  <Text weight="bold">Header Layout (justify-between + items-center)</Text>
                  <Flex spacing="md" className="justify-between items-center p-4 border-2 border-text-primary">
                    <Title variant="section">Dashboard</Title>
                    <Button variant="primary" size="sm">Add New</Button>
                  </Flex>

                  <Text weight="bold">Centered Button Group (justify-center)</Text>
                  <Flex spacing="sm" className="justify-center p-4 border-2 border-text-primary">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Delete</Button>
                    <Button variant="outline" size="sm">Share</Button>
                  </Flex>

                  <Text weight="bold">Responsive Button Bar (flex-wrap)</Text>
                  <Flex spacing="sm" className="flex-wrap justify-center lg:justify-start p-4 border-2 border-text-primary">
                    <Button variant="primary" size="sm">Primary Action</Button>
                    <Button variant="secondary" size="sm">Secondary</Button>
                    <Button variant="outline" size="sm">Tertiary</Button>
                    <Button variant="outline" size="sm">More Actions</Button>
                  </Flex>

                  <Text weight="bold">Different Heights (items-center)</Text>
                  <Flex spacing="sm" className="items-center p-4 border-2 border-text-primary h-24">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="secondary" size="md">Medium</Button>
                    <Button variant="accent" size="lg">Large</Button>
                  </Flex>
                </Stack>
              </Stack>
            </Card>

            {/* Design System Spacing */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Design System Spacing Consistency</SubSectionTitle>
                
                <Stack spacing="md">
                  <Text weight="bold">Different spacing values</Text>
                  
                  <div className="space-y-4">
                    <div>
                      <Text size="sm" color="secondary">spacing="xs" (gap-1)</Text>
                      <Flex spacing="xs" className="p-4 border-2 border-text-primary">
                        <Badge variant="category" color="primary" size="sm">Tag 1</Badge>
                        <Badge variant="category" color="secondary" size="sm">Tag 2</Badge>
                        <Badge variant="category" color="accent" size="sm">Tag 3</Badge>
                      </Flex>
                    </div>
                    
                    <div>
                      <Text size="sm" color="secondary">spacing="sm" (gap-2)</Text>
                      <Flex spacing="sm" className="p-4 border-2 border-text-primary">
                        <Badge variant="category" color="primary" size="sm">Tag 1</Badge>
                        <Badge variant="category" color="secondary" size="sm">Tag 2</Badge>
                        <Badge variant="category" color="accent" size="sm">Tag 3</Badge>
                      </Flex>
                    </div>
                    
                    <div>
                      <Text size="sm" color="secondary">spacing="lg" (gap-6)</Text>
                      <Flex spacing="lg" className="p-4 border-2 border-text-primary">
                        <Button variant="outline" size="sm">Action 1</Button>
                        <Button variant="outline" size="sm">Action 2</Button>
                        <Button variant="outline" size="sm">Action 3</Button>
                      </Flex>
                    </div>
                  </div>
                </Stack>
              </Stack>
            </Card>

            {/* Best Practices */}
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Best Practices</SubSectionTitle>
                
                <Stack spacing="sm">
                  <Text weight="bold">✅ Use Flex for:</Text>
                  <div className="pl-4 space-y-1">
                    <Text size="sm">• Consistent spacing from design system</Text>
                    <Text size="sm">• Simple layouts that need standardized gaps</Text>
                    <Text size="sm">• When you want spacing to evolve with the design system</Text>
                  </div>
                  
                  <Text weight="bold">✅ Use Tailwind directly for:</Text>
                  <div className="pl-4 space-y-1">
                    <Text size="sm">• Complex alignment (justify-between, items-end, etc.)</Text>
                    <Text size="sm">• Responsive behavior (lg:flex-col, md:justify-start)</Text>
                    <Text size="sm">• One-off layouts with specific requirements</Text>
                    <Text size="sm">• Hover states and interactions</Text>
                  </div>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Stack and Inline Examples */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Stack spacing="xl">
            <Title variant="section">Stack & Inline Examples</Title>

            <Grid columns={2} spacing="lg">
              {/* Stack Examples */}
              <Card padding="lg" shadow="dark">
                <Stack spacing="lg">
                  <SubSectionTitle>Stack (Vertical)</SubSectionTitle>
                  
                  <Stack spacing="md">
                    <Text weight="bold">Default spacing</Text>
                    <Stack spacing="md" className="p-4 border-2 border-text-primary">
                      <Button variant="primary" full>Item 1</Button>
                      <Button variant="secondary" full>Item 2</Button>
                      <Button variant="accent" full>Item 3</Button>
                    </Stack>

                    <Text weight="bold">Tight spacing</Text>
                    <Stack spacing="sm" className="p-4 border-2 border-text-primary">
                      <Text>Tightly stacked</Text>
                      <Text>Text elements</Text>
                      <Text>With small gaps</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>

              {/* Inline Examples */}
              <Card padding="lg" shadow="dark">
                <Stack spacing="lg">
                  <SubSectionTitle>Inline (Horizontal)</SubSectionTitle>
                  
                  <Stack spacing="md">
                    <Text weight="bold">Button groups</Text>
                    <Inline spacing="sm" className="p-4 border-2 border-text-primary">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                      <Button variant="outline" size="sm">Share</Button>
                    </Inline>

                    <Text weight="bold">Badge collections</Text>
                    <Inline spacing="xs" className="flex-wrap p-4 border-2 border-text-primary">
                      <Badge variant="category" color="primary" size="sm">React</Badge>
                      <Badge variant="category" color="secondary" size="sm">TypeScript</Badge>
                      <Badge variant="category" color="accent" size="sm">Tailwind</Badge>
                      <Badge variant="category" color="dark" size="sm">Vite</Badge>
                    </Inline>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Two-Column Layout Example */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Stack spacing="xl">
            <Title variant="section">Two-Column Layout Example</Title>
            
            <Card padding="lg" shadow="dark">
              <Stack spacing="md">
                <Text weight="bold" size="lg">Dashboard-Style Layout</Text>
                <Text color="secondary">
                  This demonstrates a complete two-column layout with sidebar navigation and main content area.
                </Text>
                
                {/* Embedded Two-Column Demo */}
                <div className="border-4 border-text-primary bg-background">
                  <TwoColumnLayout variant="sidebar-left" sidebarWidth="narrow" spacing="sm">
                    <TwoColumnLayout.Sidebar className="!h-96">
                      <Stack spacing="md">
                        <Text weight="bold">Navigation</Text>
                        <Stack spacing="sm">
                          <Button variant="primary" full size="sm">Dashboard</Button>
                          <Button variant="outline" full size="sm">Projects</Button>
                          <Button variant="outline" full size="sm">Settings</Button>
                          <Button variant="outline" full size="sm">Profile</Button>
                        </Stack>
                      </Stack>
                    </TwoColumnLayout.Sidebar>

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
                  </TwoColumnLayout>
                </div>
              </Stack>
            </Card>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Real-World Combination Example */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Stack spacing="xl">
            <Title variant="section">Combined Layout Patterns</Title>
            
            <Card padding="lg" shadow="dark">
              <Stack spacing="lg">
                <SubSectionTitle>Card with Complex Internal Layout</SubSectionTitle>
                
                {/* Header */}
                <Flex spacing="md" className="justify-between items-center">
                  <Stack spacing="xs">
                    <Text weight="bold" size="lg">Project Dashboard</Text>
                    <Text size="sm" color="secondary">Combining multiple layout components</Text>
                  </Stack>
                  <Inline spacing="sm">
                    <Badge variant="status" color="accent" size="sm">Active</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Inline>
                </Flex>

                {/* Stats Row */}
                <Grid columns={3} spacing="md">
                  <Card padding="md" shadow="primary">
                    <Stack spacing="sm" className="items-center">
                      <Text weight="bold" size="xl">24</Text>
                      <Text size="sm" color="secondary">Tasks</Text>
                    </Stack>
                  </Card>
                  <Card padding="md" shadow="primary">
                    <Stack spacing="sm" className="items-center">
                      <Text weight="bold" size="xl">8</Text>
                      <Text size="sm" color="secondary">Completed</Text>
                    </Stack>
                  </Card>
                  <Card padding="md" shadow="primary">
                    <Stack spacing="sm" className="items-center">
                      <Text weight="bold" size="xl">3</Text>
                      <Text size="sm" color="secondary">Overdue</Text>
                    </Stack>
                  </Card>
                </Grid>

                {/* Content Grid */}
                <Grid columns={4} spacing="lg">
                  <Grid.Item span={3}>
                    <Card padding="lg" shadow="secondary">
                      <Stack spacing="md">
                        <Text weight="bold">Recent Activity</Text>
                        <Stack spacing="sm">
                          {[1, 2, 3].map(i => (
                            <Flex key={i} spacing="sm" className="justify-between items-center p-3 border-2 border-text-primary">
                              <Stack spacing="xs">
                                <Text weight="bold">Task {i} completed</Text>
                                <Text size="sm" color="secondary">2 hours ago</Text>
                              </Stack>
                              <Badge variant="status" color="accent" size="sm">Done</Badge>
                            </Flex>
                          ))}
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid.Item>

                  <Stack spacing="md">
                    <Card padding="md" shadow="primary">
                      <Stack spacing="sm">
                        <Text weight="bold">Quick Actions</Text>
                        <Button variant="primary" full size="sm">Add Task</Button>
                        <Button variant="outline" full size="sm">Export</Button>
                      </Stack>
                    </Card>
                    
                    <Card padding="md" shadow="primary">
                      <Stack spacing="sm">
                        <Text weight="bold">Team</Text>
                        <Inline spacing="xs" className="flex-wrap">
                          <Badge variant="category" color="primary" size="sm">John</Badge>
                          <Badge variant="category" color="secondary" size="sm">Sarah</Badge>
                          <Badge variant="category" color="accent" size="sm">Mike</Badge>
                        </Inline>
                      </Stack>
                    </Card>
                  </Stack>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        </ContentContainer>
      </SectionContainer>

      {/* Footer */}
      <SectionContainer spacing="lg">
        <ContentContainer>
          <Flex spacing="md" className="justify-center border-t-4 border-text-primary pt-8">
            <Text color="secondary">
              Layout Examples • Demonstrating TwoColumnLayout, Grid, Flex, Stack & Inline components
            </Text>
          </Flex>
        </ContentContainer>
      </SectionContainer>
    </div>
  );
};