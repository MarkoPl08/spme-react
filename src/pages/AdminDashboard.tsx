import React, {useState, useEffect} from 'react';
import {fetchUsers, updateUser} from '../apis/admin';
import {User} from '../types/user';

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
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p>{error}</p>}
            <div>
                {users.map(user => (
                    <div key={user.UserID} style={{marginBottom: '20px'}}>
                        <input
                            type="text"
                            value={user.Username || ''}
                            onChange={(e) => {
                                const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                    ...u,
                                    Username: e.target.value
                                } : u);
                                setUsers(updatedUsers);
                            }}
                            placeholder="Username"
                        />
                        <input
                            type="email"
                            value={user.Email || ''}
                            onChange={(e) => {
                                const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                    ...u,
                                    Email: e.target.value
                                } : u);
                                setUsers(updatedUsers);
                            }}
                            placeholder="Email"
                        />
                        <input
                            type="number"
                            value={user.PackageID !== undefined && user.PackageID !== null ? user.PackageID.toString() : ''}
                            onChange={(e) => {
                                const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                    ...u,
                                    PackageID: e.target.value === '' ? null : parseInt(e.target.value)
                                } : u);
                                setUsers(updatedUsers);
                            }}
                            placeholder="Package ID"
                        />
                        <input
                            type="number"
                            value={user.RoleID !== undefined && user.RoleID !== null ? user.RoleID.toString() : ''}
                            onChange={(e) => {
                                const updatedUsers = users.map(u => u.UserID === user.UserID ? {
                                    ...u,
                                    RoleID: parseInt(e.target.value)
                                } : u);
                                setUsers(updatedUsers);
                            }}
                            placeholder="Role ID"
                        />
                        <button
                            onClick={() => handleUpdateUser(user.UserID, user.Username, user.Email, user.PackageID ?? null, user.RoleID)}>Update
                            User
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
