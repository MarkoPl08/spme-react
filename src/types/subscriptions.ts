export interface Package {
    PackageID: number;
    PackageName: string;
    Price: number;
    UploadLimit: number;
    StorageLimit: number;
    Features: string;
}

export interface Consumption {
    uploadCount: number;
    storageUsed: number;
}

export interface UserResponse {
    userId: number;
    username: string;
    email: string;
    packageId: number;
}

export interface ConsumptionResponse {
    user: UserResponse;
    consumption: Consumption;
}

export interface ChangePackageResponse {
    message: string;
    user: UserResponse;
}
