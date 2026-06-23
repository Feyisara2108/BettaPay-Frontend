import '@testing-library/jest-dom';

// Polyfill TextEncoder and TextDecoder for jsdom environments (common issue with Stellar SDK etc.)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock custom UI components that use complex Base UI primitives to avoid JSDOM compatibility issues
jest.mock('@/components/ui/input', () => {
  const React = require('react');
  const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={className}
        {...props}
      />
    );
  });
  Input.displayName = 'Input';
  return { Input };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');
  const Button = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  });
  Button.displayName = 'Button';
  return { Button };
});
