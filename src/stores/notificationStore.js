import { create } from 'zustand';
import {
  getNotifications,
  markAllReadApi,
  deleteNotificationApi,
} from '../features/notification/api';
/**
 * 알림 전역 스토어 (Zustand)
 *
 * 상태:
 *   notifications — 알림 배열
 *   hasUnread     — 새 알림 존재 여부 (빨간 점 표시 기준)
 *   prevIds       — 이전에 확인한 알림 id Set (새 데이터 비교용)
 *
 * 액션:
 *   fetchNotifications() — GET /notifications/ 호출, prevIds와 비교해 새 id가 있으면 hasUnread = true
 *   markAllRead()        — PUT /notifications/ 호출 후 hasUnread = false
 *   deleteOne(id)        — DELETE /notifications/<id>/ 호출 후 목록에서 제거
 *
 */
const useNotificationStore = create((set, get) => ({
  notifications: [],
  hasUnread: false,
  prevIds: new Set(),

  fetchNotifications: async () => {
    try {
      const { data } = await getNotifications();
      const list = data.results ?? data;
      const prevIds = get().prevIds;
      const hasNew = list.some((n) => !prevIds.has(n.notification_id));
      set({ notifications: list, hasUnread: hasNew });
    } catch {
      // 401 등 에러 시 조용히 무시 (로그인 안 된 상태)
    }
  },

  markAllRead: async () => {
    try {
      await markAllReadApi();
    } catch {
      /* ignore */
    }
    const notifications = get().notifications;
    set({
      hasUnread: false,
      prevIds: new Set(notifications.map((n) => n.notification_id)),
    });
  },

  deleteOne: async (id) => {
    try {
      await deleteNotificationApi(id);
    } catch {
      /* ignore */
    }
    set((s) => ({
      notifications: s.notifications.filter((n) => n.notification_id !== id),
    }));
  },
}));

export default useNotificationStore;
