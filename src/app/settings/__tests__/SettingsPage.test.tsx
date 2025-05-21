// src/app/settings/__tests__/SettingsPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '../page'; // Adjust path as necessary
import { useTheme } from 'next-themes';

// Mock the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('SettingsPage', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockSetTheme.mockClear();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'system', // Default theme for testing
      setTheme: mockSetTheme,
      resolvedTheme: 'light', // Default resolved theme
    });
  });

  it('renders the settings page with theme options', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /appearance/i })).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system/i })).toBeInTheDocument();

    const themeTextElement = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.startsWith('Current system theme:');
    });
    expect(themeTextElement).toBeInTheDocument();
    expect(themeTextElement.querySelector('span')).toHaveTextContent('light');
  });

  it('calls setTheme with "light" when Light button is clicked', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /light/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when Dark button is clicked', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "system" when System button is clicked', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /system/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('displays the correct active theme based on the hook', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    });
    render(<SettingsPage />);
    const themeTextElement = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.startsWith('Current system theme:');
    });
    expect(themeTextElement).toBeInTheDocument();
    expect(themeTextElement.querySelector('span')).toHaveTextContent('dark');
    
    // Check if the dark button has the active class (example)
    // This depends on how getButtonClass is implemented and what classes it applies.
    // For simplicity, we are not checking the exact class here, but in a real scenario you might.
    const darkButton = screen.getByRole('button', { name: /dark/i });
    // Example: expect(darkButton).toHaveClass('bg-blue-600'); // Assuming active class is bg-blue-600
  });
});
