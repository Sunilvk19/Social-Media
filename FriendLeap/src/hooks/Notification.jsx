import React, { useEffect, useState } from "react";
import localforage from "localforage";
import { getNotifications, markAsRead } from "../services/Notification";
import { getMockUsers } from "../services/Mock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck, faHeart, faUserPlus, faMessage, faHandsHelping } from "@fortawesome/free-solid-svg-icons";

const TYPE_ICONS = {
  follow: { icon: faUserPlus, color: "text-blue-400", bg: "bg-blue-400/10" },
  message: { icon: faMessage, color: "text-green-400", bg: "bg-green-400/10" },
  support: { icon: faHandsHelping, color: "text-rose-400", bg: "bg-rose-400/10" },
  like: { icon: faHeart, color: "text-pink-400", bg: "bg-pink-400/10" },
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await localforage.getItem("Current_user");
        if (!currentUser) return;

        const [notifs, mockUsers] = await Promise.all([
          getNotifications(currentUser.id),
          getMockUsers()
        ]);

        setNotifications(notifs);
        setUsers(mockUsers.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-dark">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Notifications</h1>
            <p className="text-white/40 text-sm font-medium mt-1">See who's reaching out to you</p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="glass-card rounded-[40px] p-20 text-center flex flex-col items-center">
              <div className="text-6xl mb-6 opacity-20">🍃</div>
              <h3 className="text-xl font-bold text-white/40">All quiet for now</h3>
              <p className="text-white/20 text-sm mt-2">Check back later for updates</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const sender = users.find(u => u.id === notif.senderId);
              const style = TYPE_ICONS[notif.type] || TYPE_ICONS.like;

              return (
                <div 
                  key={notif.id}
                  className={`glass-card rounded-[32px] p-6 flex items-center justify-between transition-all hover:bg-white/10 ${!notif.read ? 'border-l-4 border-cyan-500 bg-white/5' : 'opacity-60'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                        {sender?.image ? (
                          <img src={sender.image} alt={sender.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${style.bg} flex items-center justify-center text-xs ${style.color} shadow-lg border-2 border-brand-dark`}>
                        <FontAwesomeIcon icon={style.icon} />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white font-bold text-sm">
                        <span className="text-cyan-400">{sender?.firstName || "Someone"}</span> {notif.content}
                      </p>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkRead(notif.id)}
                      className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center"
                      title="Mark as read"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;