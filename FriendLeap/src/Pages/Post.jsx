import { useEffect, useRef, useState } from "react";
import Button from "../components/common/Button";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faWandMagicSparkles,
  faXmark,
  faFire,
  faCloud,
  faMoon,
  faLeaf,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../components/common/Input";

const MOODS = [
  { id: 'chill', label: 'Chill', icon: faCloud, color: 'bg-cyan-400' },
  { id: 'hype', label: 'Hype', icon: faFire, color: 'bg-orange-500' },
  { id: 'deep', label: 'Deep', icon: faMoon, color: 'bg-indigo-500 text-white' },
  { id: 'cozy', label: 'Cozy', icon: faLeaf, color: 'bg-emerald-400' },
  { id: 'spark', label: 'Spark', icon: faBolt, color: 'bg-amber-400' },
];

function Post({ onPostCreated }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState('chill');
  const fileInputRef = useRef(null);

  const workerRef = useRef(null);

  const optimizeImage = (file, maxWidth = 1080, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();
      reader.readAsDataURL(file);
      reader.onload = () => {
        image.src = reader.result;
      };
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const ratio = Math.min(1, maxWidth / image.width);
        canvas.width = image.width * ratio;
        canvas.height = image.height * ratio;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Compression Failed");
            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            resolve({
              file: optimizedFile,
              url: URL.createObjectURL(optimizedFile),
            });
          },
          "image/jpeg",
          quality,
        );
      };
      image.onerror = reject;
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await localforage.getItem(`Current_user`);
      if (!currentUser) return;
      const userProfile = await localforage.getItem(
        `User_Profile_${currentUser.id}`,
      );
      setUser({ ...currentUser, image: userProfile?.image || null });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/CaptionWorker.js", import.meta.url),
    );
    workerRef.current.onmessage = (e) => {
      const { success, data } = e.data;
      if (success && data?.caption) {
        setName(data.caption);
        setIsGenerating(false);
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 10MB");
        return;
      }
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      const optimized = await optimizeImage(file);
      setImage(optimized);
      setIsExpanded(true);
      
      workerRef.current.postMessage({
        image: optimized.url,
        name: name,
      });
      setIsGenerating(true);
    } catch (error) {
      console.error("Failed to select image", error);
    }
  };

  const removeImage = () => {
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() && !image?.file) {
      alert("Please enter a caption or upload an image");
      return;
    }
    if (!user) {
      alert("Please Login to Create Post");
      return;
    }

    try {
      setIsSubmiting(true);
      let base64Image = null;
      if (image?.file) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(image.file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
      }

      const newPost = {
        id: Date.now().toString(),
        userId: user.id,
        authorName: user.name || user.firstName || "User",
        authorImage: user.image || null,
        image: base64Image,
        name: name,
        mood: selectedMood,
        like: 0,
        comments: [],
        timestamp: new Date().toISOString(),
      };

      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      removeImage();
      setName("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to create Post", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="glass-card rounded-[40px] p-8 relative overflow-hidden group mb-8">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex gap-6">
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-full bg-linear-to-tr from-rose-400 to-pink-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white/10">
              {user?.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl">🚀</div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-2">
            <textarea
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={`What's on your mind?`}
              className="w-full bg-transparent text-white text-xl placeholder-white/10 focus:outline-none resize-none transition-all duration-300 min-h-[60px]"
            />
            
            {image && (
              <div className="relative mt-6 mb-2 animate-in fade-in zoom-in-95 duration-300">
                <img
                  src={image.url}
                  alt="Preview"
                  className="w-full max-h-80 object-cover rounded-[30px] border border-white/10 shadow-2xl"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all border border-white/10"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}

            <div className={`mt-6 pt-6 border-t border-white/5 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <div className="flex flex-col gap-8">
                {/* Mood Selector */}
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                        selectedMood === mood.id 
                          ? `${mood.color} scale-105 shadow-lg` 
                          : 'bg-white/5 text-white/30 hover:bg-white/10'
                      }`}
                    >
                      <FontAwesomeIcon icon={mood.icon} />
                      {mood.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group/btn"
                    >
                      <FontAwesomeIcon icon={faImage} className="text-xl group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      onClick={() => setIsGenerating(true)}
                      disabled={isGenerating}
                      className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-purple-400 hover:bg-purple-400 hover:text-black transition-all group/btn ${isGenerating ? 'animate-pulse' : ''}`}
                    >
                      <FontAwesomeIcon icon={faWandMagicSparkles} className="text-xl group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>

                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => {
                        setIsExpanded(false);
                        removeImage();
                        setName("");
                      }}
                      className="text-white/30 hover:text-white px-4 font-black uppercase tracking-widest text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={(!name.trim() && !image?.file) || isSubmiting}
                      className="bg-linear-to-r from-cyan-400 to-indigo-500 text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isSubmiting ? "Leaping..." : "Leap"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
