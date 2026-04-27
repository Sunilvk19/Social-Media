import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";

const MOOD_STYLES = {
  chill: { icon: faCloud, label: "Cozy", color: "bg-emerald-400 text-black" }, // Note: Adjusted labels to match image
  hype: { icon: faFire, label: "Hype", color: "bg-orange-500 text-black" },
  deep: { icon: faMoon, label: "Deep", color: "bg-indigo-500 text-white" },
  cozy: { icon: faLeaf, label: "Cozy", color: "bg-emerald-400 text-black" },
  spark: { icon: faBolt, label: "Spark", color: "bg-amber-400 text-black" },
};

const PostCard = ({ post, onLike, isLiked }) => {
  const moodStyle = MOOD_STYLES[post.mood] || MOOD_STYLES.chill;

  return (
    <div className="glass-card rounded-[40px] p-8 relative overflow-hidden group transition-all hover:translate-y-[-4px]">
      {/* Mood Tag */}
      <div className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${moodStyle.color}`}>
        <FontAwesomeIcon icon={moodStyle.icon} />
        {moodStyle.label}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-linear-to-tr from-rose-400 to-pink-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white/10">
          {post.authorImage ? (
            <img src={post.authorImage} alt={post.authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-2xl">👤</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">
            {post.authorName}
          </h3>
          <p className="text-sm text-white/30 font-medium">
            @{post.authorName?.toLowerCase().replace(/\s/g, "")} • {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-white/90 text-xl leading-relaxed font-medium">
          {post.name}
        </p>

        {post.image && (
          <div className="rounded-[30px] overflow-hidden border border-white/10 shadow-2xl">
            {post.image.startsWith("data:video/") ? (
              <video src={post.image} controls className="w-full h-auto bg-black" />
            ) : (
              <img src={post.image} alt="Leap content" className="w-full h-auto object-cover" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <div className="flex gap-6">
          <Button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:scale-110 ${isLiked ? "text-rose-500" : "text-white/40 hover:text-white"}`}
          >
            <FontAwesomeIcon icon={faHeart} className={isLiked ? "animate-pulse" : ""} />
            <span className="text-sm font-bold">{post.like || 0}</span>
          </Button>
          <Button className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-white transition-all hover:scale-110">
            <FontAwesomeIcon icon={faComment} />
            <span className="text-sm font-bold">{post.comments?.length || 0}</span>
          </Button>
        </div>
        
        <Button className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-cyan-400 transition-all font-bold text-sm">
          <FontAwesomeIcon icon={faShare} />
          Leap back
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
