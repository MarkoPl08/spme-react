import React, {useState, useEffect} from 'react';
import {fetchPhotos} from '../apis/photos';
import {Photo} from '../types/photos';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Alert,
} from '@mui/material';

const Home: React.FC = () => {
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

    return (
        <Box sx={{padding: 3, marginTop: "5rem", width: "100rem"}}>
            <Typography variant="h4" gutterBottom>
                Home Page Of This Amazing Insta Clone
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                {photos.map(photo => (
                    <Grid item xs={12} sm={6} md={4} key={photo.PhotoID}>
                        <Card>
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
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Home;
