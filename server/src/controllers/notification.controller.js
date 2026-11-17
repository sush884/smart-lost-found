import { localStore } from '../services/store.js';

export const getMyNotifications = async (req, res) => {
  try {
    const list = localStore.notifications.filter((n) => n.user_id === req.user.id);
    return res.status(200).json({ status: 'ok', data: list });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  const n = localStore.notifications.find((notif) => notif.id === id);
  if (n) n.is_read = true;
  return res.status(200).json({ status: 'ok', data: n });
};

export const markAllAsRead = async (req, res) => {
  localStore.notifications.forEach((n) => {
    if (n.user_id === req.user.id) n.is_read = true;
  });
  return res.status(200).json({ status: 'ok', message: 'All marked as read' });
};
