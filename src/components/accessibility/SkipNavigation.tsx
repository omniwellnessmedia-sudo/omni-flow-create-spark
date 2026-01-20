import React from 'react';

/**
 * Skip Navigation Component - WCAG 2.2 Compliant
 * Implements ISO 9241-171 accessibility requirements
 * 
 * Provides keyboard users with ability to skip to main content,
 * navigation, or footer without tabbing through all elements.
 */
interface SkipLink {
  href: string;
  label: string;
}

interface SkipNavigationProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#footer', label: 'Skip to footer' },
];

export const SkipNavigation: React.FC<SkipNavigationProps> = ({ 
  links = defaultLinks 
}) => {
  return (
    <nav 
      aria-label="Skip navigation"
      className="skip-nav-container"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default SkipNavigation;
