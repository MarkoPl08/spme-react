import React, {useState, useEffect} from 'react';
import {fetchPhotos, updatePhoto, downloadOriginalPhoto, downloadProcessedPhoto} from '../apis/photos';
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
    Alert
} from '@mui/material';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [description, setDescription] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const data = await fetchPhotos();
                setPhotos(data);
            } catch (error) {
                setError('Error fetching photos');
            }
        };

        loadPhotos();
    }, []);

    const handleUpdatePhoto = async (photoId: number) => {
        try {
            const updatedPhoto = await updatePhoto(photoId, description, hashtags);
            setPhotos(photos.map(photo => photo.PhotoID === photoId ? {...photo, ...updatedPhoto} : photo));
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

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Photo Gallery
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" color="primary" onClick={() => navigate('/upload')} sx={{marginBottom: 3}}>
                Back to Upload
            </Button>
            <Grid container spacing={3}>
                {photos.map(photo => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={photo.PhotoID}>
                        <Card sx={{maxWidth: 345}}>
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
