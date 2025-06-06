// src/components/__tests__/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock next/link for this test, as we are not testing navigation itself,
// but that the link is present and has the correct href.
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header', () => {
  const mockSearchQuery = 'initial query';
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
    render(
      <Header 
        searchQuery={mockSearchQuery} 
        onSearchChange={mockOnSearchChange} 
      />
    );
  });

  it('renders the catalog title', () => {
    expect(screen.getByRole('heading', { name: /opsee catalog/i })).toBeInTheDocument();
  });

  it('renders the search input with the current query and handles change', () => {
    const searchInput = screen.getByPlaceholderText(/search catalog.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue(mockSearchQuery);

    fireEvent.change(searchInput, { target: { value: 'new query' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('new query');
  });

  it('renders the settings link pointing to /settings', () => {
    // The link itself doesn't have a name, but its child (Cog6ToothIcon) might be identifiable
    // by its presence or by a wrapper element if you add one.
    // We are checking the href of the <a> tag generated by our mocked next/link.
    const settingsLink = screen.getByRole('link'); // This might be too generic if there are other links
    
    // To be more specific, let's find the link that contains the settings icon.
    // We can't directly query for the icon component easily without specific test IDs.
    // However, since next/link is mocked to <a>, we can check its href.
    // If there were multiple links, we'd need a more robust selector.
    // For now, assuming it's the only direct link role in the header apart from the title (if title was a link).
    
    // A better way if the icon was wrapped or had an aria-label on the Link:
    // const settingsLink = screen.getByRole('link', { name: /settings/i }); // If Link had aria-label="Settings"
    // For now, we'll find all links and check the one that should be settings.
    const links = screen.getAllByRole('link');
    const settingsAnchor = links.find(link => link.getAttribute('href') === '/settings');
    
    expect(settingsAnchor).toBeInTheDocument();
    expect(settingsAnchor).toHaveAttribute('href', '/settings');

    // Verify the icon is visually present (by checking for SVG or a class if a wrapper was used)
    // This part is harder without specific test-ids on icons.
    // Check if the link contains an SVG element (indicative of an icon)
    const svgIcon = settingsAnchor?.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    // A more specific check could be for a class on the SVG if one was applied by Heroicons, e.g.
    // expect(svgIcon).toHaveClass('lucide-cog'); // Example if lucide was used and applied such class
  });
});
