// src/components/__tests__/ThemeProvider.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider'; // Adjust path as necessary
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import '@testing-library/jest-dom';

// Mock the NextThemesProvider from next-themes
jest.mock('next-themes', () => {
  const originalModule = jest.requireActual('next-themes');
  return {
    ...originalModule,
    // Mock implementation that takes props and renders children
    ThemeProvider: jest.fn((props) => <div>{props.children}</div>), 
  };
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear the mock before each test
    (NextThemesProvider as jest.Mock).mockClear();
  });

  it('renders its children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <div data-testid="child-element">Hello World</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('passes props down to NextThemesProvider', () => {
    const testProps = {
      attribute: "class",
      defaultTheme: "dark",
      enableSystem: false,
      storageKey: "my-theme-key",
    };

    render(
      <ThemeProvider {...testProps}>
        <div>Child</div>
      </ThemeProvider>
    );

    // Check that NextThemesProvider was called once
    expect(NextThemesProvider).toHaveBeenCalledTimes(1);

    // Get the props passed to the mock
    const receivedProps = (NextThemesProvider as jest.Mock).mock.calls[0][0];
    
    // Check each prop individually
    expect(receivedProps.attribute).toBe(testProps.attribute);
    expect(receivedProps.defaultTheme).toBe(testProps.defaultTheme);
    expect(receivedProps.enableSystem).toBe(testProps.enableSystem);
    expect(receivedProps.storageKey).toBe(testProps.storageKey);
    expect(receivedProps.children).toBeDefined(); // Check that children are passed
  });

  it('uses default props if none are provided (where applicable)', () => {
    render(
      <ThemeProvider>
        <div>Child with defaults</div>
      </ThemeProvider>
    );
    
    expect(NextThemesProvider).toHaveBeenCalledTimes(1);
    const receivedProps = (NextThemesProvider as jest.Mock).mock.calls[0][0];
    expect(receivedProps.children).toBeDefined();
    // We don't assert other specific default props like `attribute` or `defaultTheme` here,
    // as those are defaults of the `next-themes` library itself, not our wrapper.
    // Our wrapper simply passes through what it's given.
  });
});
