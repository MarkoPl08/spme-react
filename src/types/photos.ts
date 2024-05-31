export interface Photo {
    PhotoID: number;
    UserID: number;
    PhotoPath: string;
    Description: string | null;
    Hashtags: string | null;
    UploadDateTime: string;
    User: {
        Username: string;
    }
}
