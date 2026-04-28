import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faGlobe, faUserGroup, faLock, faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";

const USER_MOODS = [
  { emoji: "😊", label: "Happy", color: "from-amber-200 via-yellow-400 to-amber-500", bg: "bg-yellow-400/10" },
  { emoji: "😢", label: "Sad", color: "from-blue-600 via-cyan-400 to-blue-600", bg: "bg-blue-400/10" },
  { emoji: "😠", label: "Angry", color: "from-red-600 via-rose-500 to-orange-600", bg: "bg-red-500/10" },
  { emoji: "😰", label: "Anxious", color: "from-purple-600 via-fuchsia-400 to-indigo-600", bg: "bg-teal-400/10" },
  { emoji: "🤩", label: "Excited", color: "from-orange-400 via-rose-400 to-amber-500", bg: "bg-pink-400/10" },
  { emoji: "🧘", label: "Calm", color: "from-teal-400 to-emerald-500", bg: "bg-cyan-400/10" },
  { emoji: "😴", label: "Tired", color: "from-slate-400 to-slate-600", bg: "bg-slate-400/10" },
  { emoji: "🙏", label: "Grateful", color: "from-amber-400 to-yellow-600", bg: "bg-amber-400/10" },
  { emoji: "😐", label: "Numb", color: "from-gray-400 to-gray-600", bg: "bg-gray-400/10" },
  { emoji: "🤯", label: "Overwhelmed", color: "from-orange-600 via-red-500 to-purple-600", bg: "bg-orange-500/10" },
  { emoji: "🎉", label: "Celebrating", color: "from-purple-400 to-fuchsia-500", bg: "bg-purple-400/10" },
  { emoji: "🔥", label: "Motivated", color: "from-orange-400 to-rose-500", bg: "bg-orange-400/10" }
];

const VISIBILITY_OPTIONS = [
  { id: "Friends", label: "Friends", icon: faGlobe, desc: "Your full network" },
  { id: "Close Friends", label: "Close Friends", icon: faStar, desc: "A curated inner circle" },
  { id: "Only Me", label: "Only Me", icon: faLock, desc: "Just a private log" }
];

const MoodPickerSheet = ({ open, onClose, onSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [visibility, setVisibility] = useState("Friends");
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      dialog?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog?.close();
      document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    }
  }, [open]);

  const handleShare = () => {
    if (selectedMood) {
      onSelect({
        ...selectedMood,
        visibility,
        updatedAt: new Date().toISOString()
      });
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-x-0 bottom-0 m-0 w-full max-w-2xl mx-auto bg-[#0a0514] border-t border-white/10 rounded-t-[50px] shadow-2xl backdrop-blur-3xl p-0 open:animate-in open:slide-in-from-bottom-full duration-500 z-100"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="p-8 md:p-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">How are you?</h2>
            <p className="text-white/40 text-sm font-medium mt-1">Share your current vibe with the circle</p>
          </div>
          <Button
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border-none"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </Button>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-12">
          {USER_MOODS.map((mood) => (
            <Button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`group relative flex flex-col items-center gap-3 p-5 rounded-[40px] transition-all duration-300 border-2 ${
                selectedMood?.label === mood.label
                  ? "border-cyan-500/50 bg-cyan-500/10 scale-105"
                  : "border-transparent bg-white/5 hover:bg-white/8"
              }`}
            >
              <div className={`text-4xl transition-transform duration-300 ${selectedMood?.label === mood.label ? 'scale-125' : 'group-hover:scale-110'}`}>
                {mood.emoji}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMood?.label === mood.label ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                {mood.label}
              </span>
              {selectedMood?.label === mood.label && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-lg animate-in zoom-in duration-300">
                  <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                </div>
              )}
            </Button>
          ))}
        </div>

      
        <div className="bg-white/5 rounded-[40px] p-8 mb-10 border border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 ml-2">Visibility & Privacy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {VISIBILITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setVisibility(option.id)}
                className={`flex flex-col items-start gap-1 p-5 rounded-[30px] transition-all border text-left ${
                  visibility === option.id
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/5 opacity-50 hover:opacity-100 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                   <FontAwesomeIcon icon={option.icon} className={visibility === option.id ? "text-cyan-400" : "text-white/40"} />
                   <span className="font-black text-xs text-white uppercase tracking-wider">{option.label}</span>
                </div>
                <p className="text-[10px] text-white/30 font-medium leading-tight">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

      
        <Button
          onClick={handleShare}
          disabled={!selectedMood}
          className="w-full bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] text-white py-8 rounded-[40px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-cyan-500/20 transition-all disabled:opacity-20 border-none"
        >
          Share Vibe
        </Button>
      </div>
    </dialog>
  );
};

export default MoodPickerSheet;
