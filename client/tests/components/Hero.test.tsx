import { it, expect, describe } from 'vitest'
import React from "react";
import {render, screen} from '@testing-library/react';
import Hero from '../../src/Components/Hero/Hero'; // Adjust the path as necessary
import '@testing-library/jest-dom/vitest';

describe("Hero Component", () => {
    it("should render without crashing", () => {
        render(<Hero />);
        // screen.debug(); // This will log the current state of the DOM
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Welcome to Our E-Shop");
    });
    it("should display the hero title", () => {
        render(<Hero />);
        const title = screen.getByText("Welcome to Our E-Shop");
        expect(title).toBeInTheDocument();
    });
    it("should display the star icon", () => {
        render(<Hero />);
        const starIcon = screen.getByText(/New Collections for everyone/i);
        expect(starIcon).toBeInTheDocument();
    });
});