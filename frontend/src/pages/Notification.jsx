import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getNotifications();
      setNotifications(data);
    }
    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div key={notif.id} className="border-b p-2">
            {notif.message}
          </div>
        ))
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
