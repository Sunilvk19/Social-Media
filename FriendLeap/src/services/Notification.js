import axios from "axios";

const API_URL = "http://localhost:5000/notifications";

export const sendNotification = async (notificationData) => {
  try {
    const response = await axios.post(API_URL, {
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
};

export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}&_sort=timestamp&_order=desc`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

export const markAsRead = async (id) => {
  try {
    await axios.patch(`${API_URL}/${id}`, { read: true });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};
