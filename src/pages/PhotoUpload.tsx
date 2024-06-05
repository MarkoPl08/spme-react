import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {uploadPhoto} from '../apis/photos';
import {parseJwt} from '../helpers/parseJwt';
import {getConsumption} from '../apis/packages';
import {
    Box,
    Button,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardActions,
    Alert
} from '@mui/material';

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [consumption, setConsumption] = useState<{
        uploadCount: number,
        storageUsed: number,
        uploadLimit: number,
        storageLimit: number
    } | null>(null);
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

    const handleViewGallery = () => {
        navigate('/photo-gallery');
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Photo Upload
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            {consumption && (
                <Card sx={{marginBottom: 3}}>
                    <CardContent>
                        <Typography variant="h5">Current Consumption</Typography>
                        <Typography>Upload Count: {consumption.uploadCount}</Typography>
                        <Typography>Storage Used: {consumption.storageUsed} MB</Typography>
                        <Typography>Remaining Uploads: {consumption.uploadLimit - consumption.uploadCount}</Typography>
                        <Typography>Remaining
                            Storage: {consumption.storageLimit - consumption.storageUsed} MB</Typography>
                    </CardContent>
                </Card>
            )}
            <Card sx={{marginBottom: 3}}>
                <CardContent>
                    <Typography variant="h5">Upload a Photo</Typography>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="upload-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file">
                        <Button variant="contained" color="primary" component="span">
                            Choose File
                        </Button>
                    </label>
                    {preview && (
                        <Box sx={{marginTop: 2}}>
                            <Typography variant="h6">Image Preview</Typography>
                            <img src={preview} alt="Preview"
                                 style={{width: '200px', height: '200px', objectFit: 'cover'}}/>
                        </Box>
                    )}
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="h6">Resize Options</Typography>
                        <TextField
                            label="Width"
                            type="number"
                            value={resizeWidth ?? ''}
                            onChange={(e) => setResizeWidth(Number(e.target.value))}
                            sx={{marginRight: 1}}
                        />
                        <TextField
                            label="Height"
                            type="number"
                            value={resizeHeight ?? ''}
                            onChange={(e) => setResizeHeight(Number(e.target.value))}
                        />
                    </Box>
                    <Box sx={{marginTop: 2}}>
                        <FormControl>
                            <InputLabel id="format-label">Format</InputLabel>
                            <Select
                                labelId="format-label"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                label="Format"
                            >
                                <MenuItem value="jpeg">JPEG</MenuItem>
                                <MenuItem value="png">PNG</MenuItem>
                                <MenuItem value="webp">WEBP</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleViewGallery}>
                        View Gallery
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default PhotoUpload;
