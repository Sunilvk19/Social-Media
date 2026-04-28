import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faCloud,
  faFire,
  faMoon,
  faLeaf,
  faBolt,
  faMessage,
  faStar,
  faHandsHoldingChild,
  faCheckCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import MoodBadge from "../mood/MoodBadge";
import { sendNotification } from "../../services/Notification";
import localforage from "localforage";

const MOOD_STYLES = {
  chill: { icon: faCloud, label: "Cozy", color: "bg-emerald-400 text-black" },
  hype: { icon: faFire, label: "Hype", color: "bg-orange-500 text-black" },
  deep: { icon: faMoon, label: "Deep", color: "bg-indigo-500 text-white" },
  cozy: { icon: faLeaf, label: "Cozy", color: "bg-emerald-400 text-black" },
  spark: { icon: faBolt, label: "Spark", color: "bg-amber-400 text-black" },
};

const DISTRESS_MOODS = ["Sad", "Anxious", "Angry", "Overwhelmed", "Numb"];

const TINT_STYLES = {
  Sad: "bg-blue-600/5 border-l-4 border-blue-500/50",
  Anxious: "bg-purple-600/5 border-l-4 border-purple-500/50",
  Angry: "bg-red-600/5 border-l-4 border-red-500/50",
  Overwhelmed: "bg-orange-600/5 border-l-4 border-orange-500/50",
  Numb: "bg-slate-600/5 border-l-4 border-slate-500/50",
  Excited: "bg-amber-600/5 border-l-4 border-amber-500/50",
};

const PostCard = ({
  post,
  onLike,
  isLiked,
  authorMood,
  currentUser,
  onDelete,
}) => {
  const [showTalkConfirm, setShowTalkConfirm] = useState(false);

  const handleSupportAction = async (type, emoji) => {
    try {
      const currentUser = await localforage.getItem("Current_user");
      if (!currentUser) return;

      await sendNotification({
        userId: post.userId,
        senderId: currentUser.id,
        type: "support",
        content: `sent you a ${type} ${emoji}`,
      });
      alert(`Sent a ${type}!`);
    } catch (err) {
      console.error(err);
    }
  };

  const moodStyle = MOOD_STYLES[post.mood] || MOOD_STYLES.chill;
  const isDistress = authorMood && DISTRESS_MOODS.includes(authorMood.label);
  const tintClass = authorMood ? TINT_STYLES[authorMood.label] : "";

  return (
    <div
      className={`glass-card rounded-[40px] p-8 relative overflow-hidden group transition-all hover:translate-y-[-4px] ${tintClass}`}
    >
      {authorMood && (
        <div className="absolute -top-4 right-20 text-8xl opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
          {authorMood.emoji}
        </div>
      )}

      <div
        className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${moodStyle.color}`}
      >
        <FontAwesomeIcon icon={moodStyle.icon} />
        {moodStyle.label}
      </div>

      {/* Author Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-full bg-linear-to-tr flex items-center justify-center overflow-hidden shadow-lg border-2 duration-300 ${authorMood ? "p-1 " + authorMood.color : "border-white/10 bg-linear-to-tr from-rose-400 to-pink-500"}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-brand-dark">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl flex items-center justify-center h-full">
                  👤
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white leading-tight">
                {post.authorName}
              </h3>
              <MoodBadge mood={authorMood} />
            </div>
            <p className="text-sm text-white/30 font-medium">
              @{post.authorName?.toLowerCase().replace(/\s/g, "")} •{" "}
              {new Date(post.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex justify-end items-end">
        {currentUser && currentUser.id === post.userId && onDelete && (
          <Button
            onClick={() => onDelete(post.id)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500 transition-all border border-transparent hover:border-red-500/50"
            title="Delete Post"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isDistress && (
          <div className="text-4xl mb-2 animate-bounce-subtle">
            {authorMood.emoji}
          </div>
        )}
        <p className="text-white/90 text-xl leading-relaxed font-medium">
          {post.name || post.content}
        </p>

        {post.image && (
          <div className="rounded-[30px] overflow-hidden border border-white/10 shadow-2xl">
            {post.image.startsWith("data:video/") ? (
              <video
                src={post.image}
                controls
                className="w-full h-auto bg-black"
              />
            ) : (
              <img
                src={post.image}
                alt="Leap content"
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        {isDistress ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {post.authorName} is feeling {authorMood.label.toLowerCase()} — be
              there for them
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowTalkConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 transition-all rounded-full font-bold text-sm text-white"
              >
                <FontAwesomeIcon icon={faMessage} className="text-blue-400" />
                Talk with {post.authorName.split(" ")[0]}
              </Button>

              <Button
                onClick={() => handleSupportAction("Cheer", "🌟")}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all rounded-full font-bold text-sm text-white"
              >
                <span className="text-lg">🌟</span>
                Send Cheer
              </Button>

              <Button
                onClick={() => handleSupportAction("Hug", "🤗")}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all rounded-full font-bold text-sm text-white"
              >
                <span className="text-lg">🤗</span>
                Hug
              </Button>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-brand-dark bg-white/10 flex items-center justify-center text-[10px]"
                  >
                    👤
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-white/30">
                <span className="text-white/60">Jordan, Sam</span> & 4 others
                already reached out
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <Button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:scale-110 ${isLiked ? "text-rose-500" : "text-white/40 hover:text-white"}`}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={isLiked ? "animate-pulse" : ""}
                />
                <span className="text-sm font-bold">{post.like || 0}</span>
              </Button>
              <Button className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-white transition-all hover:scale-110">
                <FontAwesomeIcon icon={faComment} />
                <span className="text-sm font-bold">
                  {post.comments?.length || 0}
                </span>
              </Button>
            </div>
            <Button className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-cyan-400 transition-all font-bold text-sm">
              <FontAwesomeIcon icon={faShare} />
              Leap back
            </Button>
          </div>
        )}
      </div>

      {showTalkConfirm && (
        <div className="absolute inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-3xl">
              💬
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black">
                Reach out to {post.authorName.split(" ")[0]}?
              </h4>
              <p className="text-white/50 text-sm leading-relaxed">
                They are feeling {authorMood.label.toLowerCase()} right now.
                <br />A simple message can mean the world.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  handleSupportAction("Talk Request", "💬");
                  setShowTalkConfirm(false);
                }}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-[20px] font-black uppercase tracking-widest text-xs"
              >
                Message Now
              </Button>
              <Button
                onClick={() => setShowTalkConfirm(false)}
                className="w-full bg-transparent text-white/40 hover:text-white py-2 font-bold text-sm"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
