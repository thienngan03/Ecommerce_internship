// Navbar.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../src/Components/Navbar/Navbar'; // Cập nhật đúng path
import '@testing-library/jest-dom/vitest';
import { BrowserRouter as Router } from 'react-router-dom';

// Cách 1: Gán trực tiếp vi.fn() sau khi import
import * as authHook from '../../src/Hooks/useAuth.tsx';

vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => '2'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and title', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        token: null,
        user: null,
        loading: false,
        error: '',
        buyerId: null,
        sellerId: null,
        shopId: null,
        cartCount: 0
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('E-Shop')).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        token: 'valid-token',
        user: { role: 'buyer' },
        loading: false,
        error: '',
        buyerId: '1',
        sellerId: null,
        shopId: null,
        cartCount: 0
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows login and signup when not authenticated', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        token: null,
        user: null,
        loading: false,
        error: '',
        buyerId: null,
        sellerId: null,
        shopId: null,
        cartCount: 0
    });
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
