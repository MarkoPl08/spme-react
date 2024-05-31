import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../apis/photos';
import { parseJwt } from '../helpers/parseJwt';
import { getConsumption } from '../apis/packages';

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [consumption, setConsumption] = useState<{ uploadCount: number, storageUsed: number, uploadLimit: number, storageLimit: number } | null>(null);
    const [resizeWidth, setResizeWidth] = useState<number | null>(null);
    const [resizeHeight, setResizeHeight] = useState<number | null>(null);
    const [format, setFormat] = useState<string>('jpeg');
    const navigate = useNavigate();

    const token = localStorage.getItem('jwtToken');
    const user = token ? parseJwt(token) : null;
    const userId = user ? user.userId : null;

    useEffect(() => {
        if (userId) {
            const fetchConsumption = async () => {
                try {
                    const consumptionData = await getConsumption(userId);
                    setConsumption(consumptionData);
                } catch (error) {
                    setError('Error fetching consumption');
                }
            };

            fetchConsumption();
        }
    }, [userId]);

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
                const response = await uploadPhoto(userId, selectedFile, 'description', 'hashtags', resizeWidth, resizeHeight, format);
                if ('error' in response) {
                    setError(response.error);
                } else {
                    setMessage('Photo uploaded successfully');
                    const consumptionData = await getConsumption(userId);
                    setConsumption(consumptionData);
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
    const handleViewGallery = () => {
        navigate('/photo-gallery');
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
                    <p>Remaining Uploads: {consumption.uploadLimit - consumption.uploadCount}</p>
                    <p>Remaining Storage: {consumption.storageLimit - consumption.storageUsed} MB</p>
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
                <div>
                    <h3>Resize Options</h3>
                    <input
                        type="number"
                        placeholder="Width"
                        value={resizeWidth ?? ''}
                        onChange={(e) => setResizeWidth(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Height"
                        value={resizeHeight ?? ''}
                        onChange={(e) => setResizeHeight(Number(e.target.value))}
                    />
                </div>
                <div>
                    <h3>Format</h3>
                    <select value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WEBP</option>
                    </select>
                </div>
                <button onClick={handleUpload}>Upload</button>
                <button onClick={handleViewGallery}>View Gallery</button>
            </div>
        </div>
    );
};

export default PhotoUpload;
