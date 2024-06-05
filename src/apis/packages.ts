import { Package, UserResponse, ChangePackageResponse } from '../types/subscriptions.ts';

const BASE_URL = 'http://localhost:3001';

export async function getPackages(): Promise<Package[]> {
    return fetch(`${BASE_URL}/api/subscriptions/packages`)
        .then(response => response.json());
}

export async function setPackage(userId: number, packageId: number): Promise<UserResponse | { error: string }> {
    return fetch(`${BASE_URL}/api/subscriptions/setPackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, packageId })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message) });
        }
        return response.json();
    }).catch(error => {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: 'An unknown error occurred' };
        }
    });
}

export async function getConsumption(userId: number): Promise<{ uploadCount: number, storageUsed: number, uploadLimit: number, storageLimit: number }> {
    return fetch(`${BASE_URL}/api/subscriptions/consumption/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json());
}


export async function changePackage(userId: number, newPackageId: number): Promise<ChangePackageResponse> {
    return fetch(`${BASE_URL}/api/subscriptions/changePackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPackageId })
    }).then(response => response.json());
}
