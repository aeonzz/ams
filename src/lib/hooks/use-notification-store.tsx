import { create } from "zustand";

interface NotificationState {
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (value: boolean) => void;
  checkUnreadNotifications: (notifications: any[]) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  hasUnreadNotifications: false,
  setHasUnreadNotifications: (value) => set({ hasUnreadNotifications: value }),
  checkUnreadNotifications: (notifications) => {
    const hasUnread = notifications.some(
      (notification) => !notification.isRead
    );
    set({ hasUnreadNotifications: hasUnread });
  },
}));

export default useNotificationStore;
