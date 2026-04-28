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
  faShuffle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../components/common/Input";

const MOODS = [
  { id: 'spark', label: 'Spark', icon: faBolt, color: 'bg-rose-500 shadow-rose-500/50' },
  { id: 'chill', label: 'Chill', icon: faCloud, color: 'bg-cyan-500' },
  { id: 'hype', label: 'Hype', icon: faFire, color: 'bg-orange-500' },
  { id: 'deep', label: 'Deep', icon: faMoon, color: 'bg-purple-500' },
  { id: 'cozy', label: 'Cozy', icon: faLeaf, color: 'bg-green-500' },
];

// PERSISTENT WORKER: We keep the worker alive outside the component so the AI model
// stays loaded in memory even when the modal is closed and reopened.
let globalWorker = null;

function Post({ onPostCreated, onCancel }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedMood, setSelectedMood] = useState('spark');
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);

  const MAX_CHARS = 180;

  const optimizeImage = (file, maxWidth = 1080, quality = 0.95) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const im = new Image();
      reader.readAsDataURL(file);
      reader.onload = () => {
        im.src = reader.result;
      };
      im.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const ratio = Math.min(1, maxWidth / im.width);
        canvas.width = im.width * ratio;
        canvas.height = im.height * ratio;
        ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
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
      im.onerror = reject;
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
    // Initialize global worker once
    if (!globalWorker) {
      globalWorker = new Worker(
        new URL("../workers/CaptionWorker.js", import.meta.url),
        { type: "module" }
      );
    }
    
    workerRef.current = globalWorker;

    const handleWorkerMessage = (e) => {
      // Handle progress messages separately
      if (e.data.type === 'download_progress') {
        setProgress(Math.round(e.data.progress));
        return;
      }

      const { success, data, requestId, error } = e.data;
      // Only update if this response matches our latest request
      if (requestId !== requestIdRef.current) return;
      
      if (success && data?.caption) {
        setName(data.caption.slice(0, MAX_CHARS));
      } else if (!success) {
        console.error("Caption error: ", error);
        if (error && !error.toLowerCase().includes("pipeline")) {
          alert("Failed to generate caption. Please try again.");
        }
      }
      setIsGenerating(false);
      setProgress(0); // Reset progress on finish
    };

    workerRef.current.addEventListener("message", handleWorkerMessage);

    return () => {
      // Clean up the listener, but KEEP THE WORKER ALIVE for next time
      workerRef.current?.removeEventListener("message", handleWorkerMessage);
    };
  }, []);

  const generateCaption = () => {
    if (!image?.base64) return;
    const requestId = ++requestIdRef.current;
    setIsGenerating(true);
    workerRef.current.postMessage({
      image: image.base64,
      requestId,
    });
  };

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
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(optimized.file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const newImageData = { ...optimized, base64 };
      setImage(newImageData);
      
      // Auto-generate caption for new image
      const requestId = ++requestIdRef.current;
      setIsGenerating(true);
      workerRef.current.postMessage({
        image: base64,
        requestId,
      });
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

  const handleSurpriseMe = () => {
    const prompts = [
      "Leaping into a new adventure! 🚀",
      "Just caught a vibe. ✨",
      "Current mood: Sparky! ⚡",
      "Deep thoughts on a quiet night. 🌙",
      "Living for these cozy moments. 🌿"
    ];
    setName(prompts[Math.floor(Math.random() * prompts.length)]);
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
      let base64Image = image?.base64 || null;

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
    } catch (error) {
      console.error("Failed to create Post", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="bg-[#1a1429]/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl w-full max-w-2xl relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">Send a Leap</h2>
          <Button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border-none"
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>

        {/* Input Area */}
        <div className="relative group/input mb-8">
          <div className="absolute -inset-1 bg-linear-to-r from-rose-500 to-indigo-500 rounded-[30px] blur opacity-20 group-focus-within/input:opacity-40 transition-opacity duration-500"></div>
          <div className="relative bg-brand-dark border border-white/10 rounded-[28px] overflow-hidden">
            <textarea
              id="post-caption"
              name="post-caption"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What's leaping in your mind?"
              className="w-full bg-transparent text-white/90 p-6 text-lg placeholder-white/10 focus:outline-none resize-none min-h-[160px] transition-all"
            />
            {image && (
              <div className="px-6 pb-6 relative animate-in fade-in zoom-in-95 duration-300">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <img src={image.url} alt="Preview" className="w-full max-h-48 object-cover" />
                  <Button
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all border border-white/10 hover:bg-black/80"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/70 text-xs font-black uppercase tracking-widest transition-all"
          >
            <FontAwesomeIcon icon={faImage} className="text-rose-400" />
            Add image
          </Button>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            onClick={generateCaption}
            // disabled={isGenerating || !image}
            className={`flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/70 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 ${isGenerating ? 'animate-pulse' : ''}`}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-purple-400" />
            {isGenerating 
              ? (progress > 0 ? `Loading... ${progress}%` : "Thinking...") 
              : "Smart caption"}
          </Button>
          <Button
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/70 text-xs font-black uppercase tracking-widest transition-all"
          >
            <FontAwesomeIcon icon={faShuffle} className="text-cyan-400" />
            Surprise me
          </Button>
        </div>

        {/* Mood Selectors */}
        <div className="flex flex-wrap gap-2 mb-10">
          {MOODS.map((mood) => (
            <Button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-none ${
                selectedMood === mood.id 
                  ? `${mood.color} text-white shadow-lg scale-105` 
                  : 'bg-white/5 text-white/30 hover:bg-white/10'
              }`}
            >
              <FontAwesomeIcon icon={mood.icon} />
              {mood.label}
            </Button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-8">
          <span className="text-white/20 text-sm font-black font-mono">
            {name.length}/{MAX_CHARS}
          </span>
          <Button
            onClick={handleSubmit}
            disabled={(!name.trim() && !image?.file) || isSubmiting}
            className="flex items-center gap-3 bg-linear-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-rose-500/20 hover:scale-105 transition-all disabled:opacity-50 border-none"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            {isSubmiting ? "Leaping..." : "Leap it"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Post;
