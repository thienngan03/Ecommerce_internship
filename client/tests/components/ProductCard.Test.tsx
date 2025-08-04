import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../src/Components/Shopping/productCard';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

// ✅ Mock useNavigate đúng cách
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom'); // lấy các hàm thực tế
  return {
    ...actual,
    useNavigate: () => mockNavigate, // thay thế useNavigate bằng mock
  };
});

describe('ProductCard Component', () => {
  const props = {
    productId: '1',
    productName: 'Test Product',
    productImage: 'https://via.placeholder.com/150',
    productPrice: 100,
  };

  beforeEach(() => {
    mockNavigate.mockClear(); // reset spy
  });

  it('renders product details correctly', () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$120')).toBeInTheDocument();
    expect(screen.getByText('(88)')).toBeInTheDocument();
    expect(screen.getByAltText('G x')).toHaveAttribute('src', props.productImage);
  });

  it('navigates to product detail page when card is clicked', () => {
    render(
      <MemoryRouter>
        <ProductCard {...props} />
      </MemoryRouter>
    );

   const card = screen.getByTestId('product-card');
    expect(card).toBeInTheDocument(); 
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/products/1');
  });
});
