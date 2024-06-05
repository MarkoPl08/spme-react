import React, {useState, useEffect} from 'react';
import {fetchPhotos, updatePhoto, downloadOriginalPhoto, downloadProcessedPhoto, searchPhotos} from '../apis/photos';
import {Photo} from '../types/photos';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Paper
} from '@mui/material';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [description, setDescription] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [searchDescription, setSearchDescription] = useState<string>('');
    const [searchHashtags, setSearchHashtags] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

    const loadPhotos = async () => {
        try {
            const data = await fetchPhotos();
            setPhotos(data);
        } catch (error) {
            setError('Error fetching photos');
        }
    };

    useEffect(() => {
        loadPhotos();
    }, []);

    const handleUpdatePhoto = async (photoId: number) => {
        try {
            await updatePhoto(photoId, description, hashtags);
            await loadPhotos(); // Refresh the photos state after update
            setSelectedPhoto(null);
            setDescription('');
            setHashtags('');
        } catch (error) {
            setError('Error updating photo');
        }
    };

    const handleEditClick = (photo: Photo) => {
        setSelectedPhoto(photo);
        setDescription(photo.Description || '');
        setHashtags(photo.Hashtags || '');
    };

    const handleClose = () => {
        setSelectedPhoto(null);
        setDescription('');
        setHashtags('');
    };

    const handleSearch = async () => {
        try {
            setError(null); // Clear any previous errors
            const searchParams = {
                description: searchDescription,
                hashtags: searchHashtags,
                startDate: startDate ? startDate.toISOString() : '',
                endDate: endDate ? endDate.toISOString() : '',
                username
            };
            const data = await searchPhotos(searchParams);
            console.log('Search results:', data); // Debugging: Log the search results
            setPhotos(data);
        } catch (error) {
            setError('Error searching photos');
        }
    };

    return (
        <Box sx={{padding: 3, marginTop: "5rem"}}>
            <Typography variant="h4" gutterBottom>
                Photo Gallery
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/upload')} sx={{marginBottom: 3}}>
                Back to Upload
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper sx={{padding: 3, marginBottom: 3, width: "70rem"}}>
                <Typography variant="h6" gutterBottom>
                    Search Photos
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    <TextField
                        label="Description"
                        value={searchDescription}
                        onChange={(e) => setSearchDescription(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Hashtags"
                        value={searchHashtags}
                        onChange={(e) => setSearchHashtags(e.target.value)}
                        fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                        <DesktopDatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Box>
            </Paper>
            <Grid container spacing={3}>
                {photos.map(photo => (
                    <Grid item xs={12} sm={6} md={4} key={photo.PhotoID}>
                        <Card sx={{minWidth: "20rem"}}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`http://localhost:3001/uploads/${photo.PhotoPath}`}
                                alt={photo.Description || 'No description available'}
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.jpg';
                                }}
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {photo.Description || 'No description'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    By: {photo.User?.Username || 'Unknown'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Uploaded: {new Date(photo.UploadDateTime).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Hashtags: {photo.Hashtags || 'No hashtags'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleEditClick(photo)}>
                                    Edit
                                </Button>
                                <Button size="small" color="primary"
                                        onClick={() => downloadOriginalPhoto(photo.PhotoID)}>
                                    Download Original
                                </Button>
                                <Button size="small" color="primary"
                                        onClick={() => downloadProcessedPhoto(photo.PhotoID)}>
                                    Download Processed
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedPhoto && (
                <Dialog open={Boolean(selectedPhoto)} onClose={handleClose}>
                    <DialogTitle>Edit Photo</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Photo ID: {selectedPhoto.PhotoID}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Hashtags"
                            type="text"
                            fullWidth
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleUpdatePhoto(selectedPhoto.PhotoID)} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default PhotoGallery;
