import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {uploadPhoto} from '../apis/photos';
import {parseJwt} from '../helpers/parseJwt';
import {getConsumption} from '../apis/packages';

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [consumption, setConsumption] = useState<{ uploadCount: number; storageUsed: number } | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('jwtToken');
    const user = token ? parseJwt(token) : null;
    const userId = user ? user.userId : null;

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    }, [selectedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        console.log('User ID:', userId);
        if (selectedFile && userId) {
            try {
                const response = await uploadPhoto(userId, selectedFile, 'description', 'hashtags');
                console.log('Response:', response);
                if ('error' in response) {
                    setError(response.error);
                } else {
                    setMessage('Photo uploaded successfully');
                    const consumptionData = await getConsumption(userId);
                    setConsumption(consumptionData.consumption);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            }
        } else {
            setError('Missing required data for upload');
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
        <div>
            <h1>Photo Upload</h1>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            {consumption && (
                <div>
                    <h2>Current Consumption</h2>
                    <p>Upload Count: {consumption.uploadCount}</p>
                    <p>Storage Used: {consumption.storageUsed} MB</p>
                </div>
            )}
            <div>
                <h2>Upload a Photo</h2>
                <input type="file" onChange={handleFileChange}/>
                {preview && (
                    <div>
                        <h3>Image Preview</h3>
                        <img src={preview} alt="Preview" style={{width: '200px', height: '200px', objectFit: 'cover'}}/>
                    </div>
                )}
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
};

export default PhotoUpload;
