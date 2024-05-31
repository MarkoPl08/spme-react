import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConsumption, getPackages, setPackage } from '../apis/packages';
import { Package, Consumption } from '../types/subscriptions';
import { parseJwt } from '../helpers/parseJwt';

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
                    setConsumption(consumptionData.consumption);
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

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
            {consumption && (
                <div>
                    <h2>Current Consumption</h2>
                    <p>Upload Count: {consumption.uploadCount}</p>
                    <p>Storage Used: {consumption.storageUsed} MB</p>
                </div>
            )}
            <div>
                <h2>Select a Package</h2>
                <ul>
                    {packages.map(pkg => (
                        <li key={pkg.PackageID}>
                            <button onClick={() => handlePackageSelect(pkg.PackageID)}>
                                {pkg.PackageName} - ${pkg.Price}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Upload a Photo</h2>
                <button onClick={() => navigate('/upload')}>Go to Upload Page</button>
            </div>
        </div>
    );
};

export default Dashboard;
