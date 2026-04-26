import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faCloud,
  faMoon,
  faLeaf,
  faBolt,
  faRainbow,
} from "@fortawesome/free-solid-svg-icons";

const MOODS = [
  { id: "all", label: "All vibes", icon: faRainbow, color: "from-purple-400 to-blue-500" },
  { id: "spark", label: "Spark", icon: faBolt, color: "from-amber-400 to-orange-500" },
  { id: "chill", label: "Chill", icon: faCloud, color: "from-cyan-400 to-blue-400" },
  { id: "hype", label: "Hype", icon: faFire, color: "from-orange-500 to-red-600" },
  { id: "deep", label: "Deep", icon: faMoon, color: "from-indigo-500 to-purple-600" },
  { id: "cozy", label: "Cozy", icon: faLeaf, color: "from-emerald-400 to-teal-500" },
];

const MoodFilter = ({ activeMood, onMoodChange }) => {
  return (
    <div className="glass-card rounded-[40px] p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-cyan-400">
           <FontAwesomeIcon icon={faRainbow} className="rotate-12" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest text-white/90">
          Leap by Mood
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
              activeMood === mood.id
                ? `bg-linear-to-r ${mood.color} text-black scale-105 shadow-lg`
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FontAwesomeIcon icon={mood.icon} />
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodFilter;
