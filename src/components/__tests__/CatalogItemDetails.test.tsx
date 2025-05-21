// src/components/__tests__/CatalogItemDetails.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react'; // Added within
import CatalogItemDetails from '../CatalogItemDetails'; // Adjust path
import { CatalogItem } from '@/types/catalog'; // Adjust path
import '@testing-library/jest-dom'; // For expect(...).toBeInTheDocument()

// Mock a part of the utils that might be complex or not relevant to the component's own logic
jest.mock('@/utils/catalog', () => ({
  ...jest.requireActual('@/utils/catalog'), // Import and retain default behavior
  getItemIcon: jest.fn(() => '🪙'), // Mock specific function if needed
  getScoreColor: jest.fn(() => 'bg-blue-500'),
  getKindColor: jest.fn(() => 'bg-green-500'),
}));

const mockItem: CatalogItem = {
  apiVersion: 'v1',
  id: 'test-item-123',
  kind: 'Component',
  class: 'Service',
  metadata: {
    name: 'Test Service Item',
    description: 'This is a detailed description of the test service.',
    labels: { env: 'test', tier: 'backend' },
    annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
    tier: 'Tier 1',
    license: 'Apache-2.0',
  },
  score: { value: 95, label: 'A' },
  contact: {
    owner: { id: 'owner-group', type: 'Group', fqId: 'slack://#owner-channel' },
    contributors: [{ id: 'user1', type: 'User', fqId: 'mailto:user1@example.com', intent: 'Maintainer' }],
    support: [{ id: 'support-chat', type: 'Slack', fqId: 'slack://#support', description: 'Main support channel' }],
  },
  classification: {
    domain: 'Payments',
    team: 'Alpha Team',
    capability: 'Transaction Processing',
    tag: 'java,spring',
  },
  dependencies: {
    upstream: ['core-library'],
    downstream: ['reporting-service'],
    triggers: ['event-bus'],
    providedBy: 'infra-team-platform',
  },
  links: [
    { type: 'repository', url: 'https://github.com/org/repo', description: 'Source Code Repo' },
    { type: 'dashboard', url: 'https://grafana.example.com/d/123', classifier: 'metrics' },
    { type: 'documentation', url: 'https://docs.example.com/service' },
  ],
  properties: {
    customField: 'customValue',
    nested: {
      anotherKey: 123,
      deep: {
        finalKey: true,
      },
    },
    arrayProp: ['val1', 'val2'],
  },
  runtime: {
    endpoint: 'https://api.example.com/service',
  },
  debt: {
    total: 2,
    entries: [
      { name: 'Refactor old module', description: 'Needs update to new framework', severity: 'High' },
      { name: 'Improve test coverage', description: 'Current coverage is 60%', severity: 'Medium' },
    ],
  },
  audit: {
    total: 1,
    operations: [
      { name: 'Create', description: 'Initial creation', updated: '2024-01-01T10:00:00Z', updatedBy: 'admin' },
    ],
  },
};


describe('CatalogItemDetails', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders nothing if item is null', () => {
    const { container } = render(<CatalogItemDetails item={null} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders item name and description', () => {
    render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
    expect(screen.getByText(mockItem.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(mockItem.metadata.description!)).toBeInTheDocument(); // Use non-null assertion if sure
  });

  it('renders sections correctly', () => {
    render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
    expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contacts/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /classification/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dependencies/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /links/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /properties/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /runtime information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /technical debt/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /audit log/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /metadata details/i })).toBeInTheDocument();
  });

  describe('Smart Formatting Tests', () => {
    it('renders nested properties', () => {
      render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
      expect(screen.getByText(/Custom Field:/i)).toBeInTheDocument();
      expect(screen.getByText('customValue')).toBeInTheDocument();
      expect(screen.getByText(/Nested:/i)).toBeInTheDocument();
      expect(screen.getByText(/Another Key:/i)).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText(/Deep:/i)).toBeInTheDocument();
      expect(screen.getByText(/Final Key:/i)).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();
      
      // Test array display as rendered by PropertiesDisplay
      const propertiesSection = screen.getByRole('heading', { name: /Properties/i }).closest('div');
      expect(propertiesSection).toBeInTheDocument();

      if (propertiesSection) { // Ensure section is found before querying within it
        expect(within(propertiesSection).getByText(/Array Prop:/i)).toBeInTheDocument();
        expect(within(propertiesSection).getByText(/0:/i)).toBeInTheDocument(); // Index as key
        expect(within(propertiesSection).getByText('val1')).toBeInTheDocument();
        expect(within(propertiesSection).getByText(/1:/i)).toBeInTheDocument(); // Index as key
        expect(within(propertiesSection).getByText('val2')).toBeInTheDocument();
      }
    });

    it('renders links with URLs and icons', () => {
      render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
      const repoLink = screen.getByText(mockItem.links[0].url);
      expect(repoLink).toBeInTheDocument();
      expect(repoLink.closest('a')).toHaveAttribute('href', mockItem.links[0].url);
      // Check for icons (presence of SVG or specific class, simplified here)
      expect(repoLink.previousSibling).toHaveClass('w-5 h-5'); // Check for an icon element

      const dashboardLink = screen.getByText(mockItem.links[1].url);
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink.closest('a')).toHaveAttribute('href', mockItem.links[1].url);
      expect(dashboardLink.previousSibling).toHaveClass('w-5 h-5');
    });

    it('renders debt items with severity', () => {
      render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
      expect(screen.getByText(mockItem.debt.entries[0].name)).toBeInTheDocument();
      expect(screen.getByText('Severity: High')).toBeInTheDocument();
      const highSeverityContainer = screen.getByText('Severity: High').closest('div');
      expect(highSeverityContainer).toHaveClass('text-red-500'); // Check the container for the color class

      expect(screen.getByText(mockItem.debt.entries[1].name)).toBeInTheDocument();
      expect(screen.getByText('Severity: Medium')).toBeInTheDocument();
      const mediumSeverityContainer = screen.getByText('Severity: Medium').closest('div');
      expect(mediumSeverityContainer).toHaveClass('text-orange-500');
    });

    it('renders contacts with fqId links', () => {
      render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
      // Owner
      expect(screen.getByText('Owner')).toBeInTheDocument();
      const ownerFqId = screen.getByText(mockItem.contact.owner.fqId!);
      expect(ownerFqId.closest('a')).toHaveAttribute('href', mockItem.contact.owner.fqId);
      
      // Contributor
      expect(screen.getByText('Contributor 1')).toBeInTheDocument();
      const contributorFqIdText = mockItem.contact.contributors![0].fqId!.substring(7); // remove mailto:
      const contributorFqId = screen.getByText(contributorFqIdText);
      expect(contributorFqId.closest('a')).toHaveAttribute('href', mockItem.contact.contributors![0].fqId);
    });
  });

  it('calls onClose when the close button is clicked', () => {
    render(<CatalogItemDetails item={mockItem} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: /close panel/i }); // Updated to use the new aria-label
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles item with minimal data gracefully', () => {
    const minimalItem: CatalogItem = {
      apiVersion: 'v1',
      id: 'minimal-item',
      kind: 'Service',
      class: 'API',
      metadata: { name: 'Minimal Service' },
      score: { value: 0, label: 'N/A' },
      contact: {}, // Empty contact
      classification: {},
      dependencies: {},
      links: [],
      properties: {},
      debt: { total:0, entries: [] },
      audit: { total:0, operations: [] },
    };
    render(<CatalogItemDetails item={minimalItem} onClose={mockOnClose} />);
    expect(screen.getByText('Minimal Service')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /overview/i })).toBeInTheDocument();
    // Check that sections that would be empty don't cause errors
    // For example, Properties section might not render if no properties
    expect(screen.queryByRole('heading', { name: /properties/i })).toBeNull(); 
    // Or if it renders the title but no items, that's also fine.
    // The key is no crash and graceful display.
  });

});
