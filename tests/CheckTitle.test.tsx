// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom';
import PhotoGallery from '../src/pages/PhotoGallery';
import AdminDashboard from "../src/pages/AdminDashboard";
import UserDashboard from "../src/pages/UserDashboard";
import AdminPhotoManagement from "../src/pages/AdminPhotoManagement";

test('renders photo gallery', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <PhotoGallery />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/Photo Gallery/i)).toBeInTheDocument();
});

test('Admin Dashboard', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
});

test('Dashboard', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <UserDashboard />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});

test('Manage Photos', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <AdminPhotoManagement />
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/Manage Photos/i)).toBeInTheDocument();
});

