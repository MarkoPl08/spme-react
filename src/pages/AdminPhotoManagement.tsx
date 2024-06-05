import React, {useState, useEffect} from 'react';
import {deletePhoto, fetchPhotos} from '../apis/admin';
import {Photo} from '../types/photos';
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Grid,
    Alert
} from '@mui/material';

const AdminPhotoManagement: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    const handleDeletePhoto = async (photoId: number) => {
        try {
            await deletePhoto(photoId);
            setPhotos(photos.filter(photo => photo.PhotoID !== photoId));
        } catch (error) {
            setError('Error deleting photo');
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Manage Photos
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                {photos.map(photo => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={photo.PhotoID}>
                        <Card sx={{maxWidth: 345}}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`http://localhost:3001/${photo.PhotoPath}`}
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
                                <Button size="small" color="secondary" onClick={() => handleDeletePhoto(photo.PhotoID)}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminPhotoManagement;
