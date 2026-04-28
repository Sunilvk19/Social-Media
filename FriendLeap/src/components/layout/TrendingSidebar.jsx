import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

const TRENDING_TOPICS = [
  { tag: "#midnightcoffee", count: "12 leaps" },
  { tag: "#firstapp", count: "24 leaps" },
  { tag: "#oceanbrain", count: "36 leaps" },
  { tag: "#carbtherapy", count: "48 leaps" },
];

const TrendingSidebar = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[40px] p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-orange-500">
            <FontAwesomeIcon icon={faFire} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white/90">
            Leaping Now
          </h2>
        </div>

        <div className="space-y-6">
          {TRENDING_TOPICS.map((topic, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer">
              <span className="text-[17px] font-bold text-white/90 group-hover:text-cyan-400 transition-colors">
                {topic.tag}
              </span>
              <span className="text-xs font-medium text-white/20">
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Card */}
      <div className="rounded-[40px] p-8 bg-linear-to-br from-purple-500 via-indigo-600 to-cyan-500 relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <circle cx="90" cy="80" r="15" fill="white" />
             <circle cx="85" cy="70" r="8" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <h3 className="text-3xl font-black text-white mb-4 leading-[1.1]">
            No feed.<br />Just leaps.
          </h3>
          <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[200px]">
            Friend Leap shows you moments — never an algorithm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
