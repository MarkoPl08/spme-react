import { User } from '../types/user';

const BASE_URL = 'http://localhost:3001';

export async function fetchUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch users:', errorText);
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export async function updateUser(userId: number, username: string, email: string, packageId: number | null, roleId: number): Promise<User> {
    const response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({ username, email, packageId, roleId })
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update user:', errorText);
        throw new Error('Failed to update user');
    }
    return response.json();
}

export async function fetchPhotos() {
    const response = await fetch(`${BASE_URL}/api/photos/all`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    return response.json();
}

export async function deletePhoto(photoId: number) {
    const response = await fetch(`${BASE_URL}/api/admin/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    return response.json();
}
