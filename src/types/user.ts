export interface User {
    UserID: number;
    Username: string;
    Email: string;
    RoleID: number;
    PackageID?: number | null;
    UploadCount: number;
    StorageUsed: number;
    CreatedAt: string;
    UpdatedAt: string;
    LastPackageUpdate?: string | null;
}
