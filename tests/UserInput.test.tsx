// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { registerUser } from '../src/apis/authApi.ts';
import EmailRegisterComponent from "../src/pages/auth/EmailRegisterComponent";

jest.mock('../src/apis/authApi.ts', () => ({
    registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

test('allows user to interact with input and submit button', async () => {
    (registerUser as jest.Mock).mockResolvedValue({ user: { id: 1, username: 'testuser' } });

    await act(async () => {
        render(
            <MemoryRouter>
                <EmailRegisterComponent />
            </MemoryRouter>
        );
    });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });

    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
    });

    await act(async () => {
        fireEvent.click(registerButton);
    });

    expect(registerUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 1,
        packageId: 1,
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
});
