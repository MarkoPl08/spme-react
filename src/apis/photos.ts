import {Photo} from "../types/photos.ts";

const BASE_URL = 'http://localhost:3000';

export async function fetchPhotos(): Promise<Photo[]> {
    return fetch(`${BASE_URL}/api/photos/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message)
            });
        }
        return response.json();
    }).catch(error => {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('An unknown error occurred');
        }
    });
}

export async function uploadPhoto(
    userId: number,
    file: File,
    description: string,
    hashtags: string,
    resizeWidth: number | null,
    resizeHeight: number | null,
    format: string
): Promise<{ message: string } | { error: string }> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('photo', file);
    formData.append('description', description);
    formData.append('hashtags', hashtags);
    if (resizeWidth !== null) formData.append('resizeWidth', resizeWidth.toString());
    if (resizeHeight !== null) formData.append('resizeHeight', resizeHeight.toString());
    formData.append('format', format);

    return fetch(`${BASE_URL}/api/photos/upload`, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message)
            });
        }
        return response.json();
    }).catch(error => {
        if (error instanceof Error) {
            return {error: error.message};
        } else {
            return {error: 'An unknown error occurred'};
        }
    });
}

export async function updatePhoto(photoId: number, description: string, hashtags: string): Promise<Photo> {
    return fetch(`${BASE_URL}/api/photos/update/${photoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, hashtags })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message) });
        }
        return response.json();
    }).catch(error => {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('An unknown error occurred');
        }
    });
}

export async function searchPhotos(searchParams: { description: string; hashtags: string; startDate: string; endDate: string; username: string; }): Promise<Photo[]> {
    return fetch(`${BASE_URL}/api/photos/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
    }).then(response => response.json());
}

export async function downloadOriginalPhoto(photoId: number) {
    window.open(`${BASE_URL}/api/photos/download/original/${photoId}`, '_blank');
}

export async function downloadProcessedPhoto(photoId: number) {
    window.open(`${BASE_URL}/api/photos/download/processed/${photoId}`, '_blank');
}