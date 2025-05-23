// src/components/__tests__/Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer'; // Adjust path as necessary
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders the copyright notice with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(`© ${currentYear} OpsEE Catalog. All rights reserved.`);
    expect(copyrightText).toBeInTheDocument();
  });

  it('renders privacy policy and terms of service links', () => {
    render(<Footer />);
    
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '#'); // Placeholder link

    const termsLink = screen.getByRole('link', { name: /terms of service/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '#'); // Placeholder link
  });
});
