import React, {useState, useEffect} from 'react';
import {fetchUsers, updateUser} from '../apis/admin';
import {User} from '../types/user';
import AdminPhotoManagement from './AdminPhotoManagement';
import {
    Box,
    Button,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActions,
    Alert
} from '@mui/material';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                setError('Error fetching users');
            }
        };

        loadUsers();
    }, []);

    const handleUpdateUser = async (userId: number, username: string, email: string, packageId: number | null, roleId: number) => {
        try {
            const updatedUser = await updateUser(userId, username, email, packageId, roleId);
            setUsers(users.map(user => user.UserID === userId ? {...user, ...updatedUser} : user));
        } catch (error) {
            setError('Error updating user');
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container spacing={3}>
                {users.map(user => (
                    <Grid item xs={12} md={6} key={user.UserID}>
                        <Card>
                            <CardContent>
                                <TextField
                                    label="Username"
                                    type="text"
                                    fullWidth
                                    value={user.Username || ''}
                                    onChange={(e) => {
                                        const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                            ...u,
                                            Username: e.target.value
                                        } : u);
                                        setUsers(updatedUsers);
                                    }}
                                    placeholder="Username"
                                    sx={{marginBottom: 2}}
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={user.Email || ''}
                                    onChange={(e) => {
                                        const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                            ...u,
                                            Email: e.target.value
                                        } : u);
                                        setUsers(updatedUsers);
                                    }}
                                    placeholder="Email"
                                    sx={{marginBottom: 2}}
                                />
                                <TextField
                                    label="Package ID"
                                    type="number"
                                    fullWidth
                                    value={user.PackageID !== undefined && user.PackageID !== null ? user.PackageID.toString() : ''}
                                    onChange={(e) => {
                                        const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                            ...u,
                                            PackageID: e.target.value === '' ? null : parseInt(e.target.value)
                                        } : u);
                                        setUsers(updatedUsers);
                                    }}
                                    placeholder="Package ID"
                                    sx={{marginBottom: 2}}
                                />
                                <TextField
                                    label="Role ID"
                                    type="number"
                                    fullWidth
                                    value={user.RoleID !== undefined && user.RoleID !== null ? user.RoleID.toString() : ''}
                                    onChange={(e) => {
                                        const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                            ...u,
                                            RoleID: parseInt(e.target.value)
                                        } : u);
                                        setUsers(updatedUsers);
                                    }}
                                    placeholder="Role ID"
                                    sx={{marginBottom: 2}}
                                />
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateUser(user.UserID, user.Username, user.Email, user.PackageID ?? null, user.RoleID)}
                                >
                                    Update User
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <AdminPhotoManagement/>
        </Box>
    );
};

export default AdminDashboard;
