/// <reference path="./INotification.d.ts" />

export default class NotificationsPlayer {
    private notifications: INotification[];

    constructor(notifications: INotification[]) {
        this.notifications = notifications;
    }

    public play(relativeTime: number): void {
        var unplayedNotifications = this.notifications.filter((n) => n.time <= relativeTime && !n.isCompleted);

        unplayedNotifications.forEach((n) => {
            n.isCompleted = true;
            n.play();
        });
    }

    public markAsPlayed(relativeTime: number): void {
        var unplayedNotifications = this.notifications.filter((n) => n.time <= relativeTime && !n.isCompleted);

        unplayedNotifications.forEach((n) => {
            n.isCompleted = true;
        });
    }
}
