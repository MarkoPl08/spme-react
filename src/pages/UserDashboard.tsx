import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getConsumption, getPackages, setPackage} from '../apis/packages';
import {Package, Consumption} from '../types/subscriptions';
import {Box, Button, Typography, Card, CardContent, CardActions, Alert, Grid} from '@mui/material';
import {parseJwt} from '../helpers/parseJwt';

const Dashboard: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [consumption, setConsumption] = useState<Consumption | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('jwtToken');
    const user = token ? parseJwt(token) : null;
    const userId = user ? user.userId : null;

    useEffect(() => {
        if (userId) {
            const fetchPackages = async () => {
                try {
                    const packagesData = await getPackages();
                    setPackages(packagesData);
                } catch (error) {
                    setError('Error fetching packages');
                }
            };

            const fetchConsumption = async () => {
                try {
                    const consumptionData = await getConsumption(userId);
                    setConsumption(consumptionData);
                } catch (error) {
                    setError('Error fetching consumption');
                }
            };

            fetchPackages();
            fetchConsumption();
        } else {
            setError('User ID not found');
        }
    }, [userId]);

    const handlePackageSelect = async (packageId: number) => {
        if (userId) {
            try {
                const response = await setPackage(userId, packageId);
                if ('error' in response) {
                    setError(response.error);
                } else {
                    alert('Package updated successfully');
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            }
        } else {
            setError('User ID not found');
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {consumption && (
                <Card sx={{marginBottom: 3}}>
                    <CardContent>
                        <Typography variant="h5">Current Consumption</Typography>
                        <Typography>Upload Count: {consumption.uploadCount}</Typography>
                        <Typography>Storage Used: {consumption.storageUsed} MB</Typography>
                    </CardContent>
                </Card>
            )}
            <Card sx={{
                marginBottom: 3
            }}>
                <CardContent>
                    <Typography variant="h5">Select a Package</Typography>
                    <Grid container spacing={2}>
                        {packages.map((pkg) => (
                            <Grid item xs={12} md={4} key={pkg.PackageID}>
                                <Card sx={{
                                    display: "flex",
                                    justifyItems: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }}>
                                    <CardContent>
                                        <Typography variant="h6">{pkg.PackageName}</Typography>
                                        <Typography>${pkg.Price}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="contained" color="primary"
                                                onClick={() => handlePackageSelect(pkg.PackageID)}>
                                            Select
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>
                <CardContent>
                    <Typography variant="h5">Upload a Photo</Typography>
                </CardContent>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={() => navigate('/upload')}>
                        Go to Upload Page
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default Dashboard;
