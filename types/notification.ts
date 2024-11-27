export interface Notification {
    id: number;
    notification: { id: number; notiType: string; notiName: string; message: string };
    read: boolean;
    createdDate: string | Date;
}
