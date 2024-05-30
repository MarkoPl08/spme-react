const BASE_URL = 'http://localhost:3000';

export async function uploadPhoto(userId: number, file: File, description: string, hashtags: string): Promise<{ message: string } | { error: string }> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('photo', file);
    formData.append('description', description);
    formData.append('hashtags', hashtags);

    return fetch(`${BASE_URL}/api/photos/upload`, {
        method: 'POST',
        body: formData
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



