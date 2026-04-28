import React from "react";

const MoodBadge = ({ mood, className = "" }) => {
  if (!mood) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md shadow-sm ${className}`}>
      <span className="text-sm">{mood.emoji}</span>
      <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
        {mood.label}
      </span>
    </div>
  );
};

export default MoodBadge;