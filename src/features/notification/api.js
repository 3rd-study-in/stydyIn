import axiosInstance from '../../lib/axiosInstance';

// GET /notifications/ — 전체 목록 (paginated: results, count, next, previous)
export const getNotifications = () => axiosInstance.get('/notifications/');

// PUT /notifications/ — 전체 읽음 처리
export const markAllReadApi = () => axiosInstance.put('/notifications/');

// PUT /notifications/<id>/ — 단건 읽음 처리
export const markOneReadApi = (id) => axiosInstance.put(`/notifications/${id}/`);

// DELETE /notifications/<id>/ — 단건 삭제
export const deleteNotificationApi = (id) => axiosInstance.delete(`/notifications/${id}/`);

// DELETE /notifications/ — 전체 삭제
export const deleteAllNotificationsApi = () => axiosInstance.delete('/notifications/');
