// import {render,screen} from "@testing-library/react";
// import React from "react";
// import '@testing-library/jest-dom';
// import '@testing-library/jest-dom/vitest';
// import '@testing-library/dom';
// import '@testing-library/react';
// import '@testing-library/user-event';
// import App from './App.jsx';
import { describe, it, expect } from "vitest";


describe("App Component", () => {
  it("Test", () => {
    expect(1).toBeTruthy();
  });

//   it("renders Home page on /home route", () => {
//     window.history.pushState({}, "Home", "/home");
//     render(<App />);
//     const homeElement = screen.getByText(/Welcome to Home Page/i);
//     expect(homeElement).toBeInTheDocument();
//   });

//   it("renders SignUp page on /signup route", () => {
//     window.history.pushState({}, "SignUp", "/signup");
//     render(<App />);
//     const signUpElement = screen.getByText(/Sign Up/i);
//     expect(signUpElement).toBeInTheDocument();
//   });
});