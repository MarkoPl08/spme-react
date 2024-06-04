// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import PhotoGallery from "../src/pages/PhotoGallery";
import AdminDashboard from "../src/pages/AdminDashboard";
import UserDashboard from "../src/pages/UserDashboard";
import AdminPhotoManagement from "../src/pages/AdminPhotoManagement";
import EmailRegisterComponent from "../src/pages/auth/EmailRegisterComponent";

test('renders without crashing', () => {
    render(
        <MemoryRouter>
            <PhotoGallery />
        </MemoryRouter>
    );
    expect(screen.getByText(/Photo Gallery/i)).toBeInTheDocument();
});

test('renders without crashing', () => {
    render(
        <MemoryRouter>
            <AdminDashboard />
        </MemoryRouter>
    );
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
});

test('renders without crashing', () => {
    render(
        <MemoryRouter>
            <UserDashboard />
        </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});

test('renders without crashing', () => {
    render(
        <MemoryRouter>
            <AdminPhotoManagement />
        </MemoryRouter>
    );
    expect(screen.getByText(/Manage Photos/i)).toBeInTheDocument();
});

test('renders without crashing', () => {
    render(
        <MemoryRouter>
            <EmailRegisterComponent />
        </MemoryRouter>
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
});
