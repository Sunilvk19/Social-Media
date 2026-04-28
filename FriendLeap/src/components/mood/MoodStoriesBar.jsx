import React from "react";

const MOOD_COLOR_MAP = {
  Happy: "from-amber-200 via-yellow-400 to-amber-500",
  Sad: "from-blue-600 via-cyan-400 to-blue-600",
  Angry: "from-red-600 via-rose-500 to-orange-600",
  Anxious: "from-purple-600 via-fuchsia-400 to-indigo-600",
  Excited: "from-orange-400 via-rose-400 to-amber-500",
  Calm: "from-teal-400 to-emerald-500",
  Tired: "from-slate-400 to-slate-600",
  Grateful: "from-amber-400 to-yellow-600",
  Numb: "from-gray-400 to-gray-600",
  Overwhelmed: "from-orange-600 via-red-500 to-purple-600",
  Celebrating: "from-purple-400 to-fuchsia-500",
  Motivated: "from-orange-400 to-rose-500"
};

const MoodStoriesBar = ({ users = [] }) => {
  const usersWithMood = users.filter((u) => u?.mood);

  if (usersWithMood.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-6">
      <div className="flex gap-6 items-start px-2">
        {usersWithMood.map((user) => {
          const gradient = MOOD_COLOR_MAP[user.mood.label] || "from-gray-400 to-gray-600";

          return (
            <div key={user.id} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
              <div className={`relative p-1 rounded-full bg-linear-to-tr ${gradient} transition-transform duration-300 group-hover:scale-110 active:scale-95 shadow-lg shadow-black/20`}>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-dark bg-brand-dark flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl">👤</div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-dark border border-white/10 rounded-full flex items-center justify-center text-lg shadow-xl animate-in zoom-in duration-500">
                  {user.mood.emoji}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black text-white/90 truncate max-w-[80px]">
                  {user.firstName}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-cyan-400 transition-colors">
                  {user.mood.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodStoriesBar;