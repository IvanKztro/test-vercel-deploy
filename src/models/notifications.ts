export interface AppNotification {
  id: string;
  title: string;
  icon: string;
  description: string;
  createdBy: string;
  date: any;
  status: NotificationsStatus;
  link?: string;
}

export enum NotificationsStatus {
  Read = "Read",
  Unread = "Unread",
}
