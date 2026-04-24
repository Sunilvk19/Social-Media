import { useEffect, useRef, useState } from "react";
import Button from "../components/common/Button";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import Input from "../components/common/Input";

function Post({ onPostCreated }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

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
            if (!blob) return reject("Comprestion Failed");
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
      const userProfile = await localforage.getItem(
        `User_Profile_${currentUser.id}`,
      );
      if (currentUser) {
        setUser({ ...currentUser, image: userProfile?.image || null });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    return () => {
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image]);

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Please upload an image or video file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }

      if (file.type.startsWith("image/")) {
        const optimized = await optimizeImage(file);
        setImage(optimized);
      } else {
        setImage({
          file,
          url: URL.createObjectURL(file),
        });
      }
      setIsExpanded(true);
    } catch (error) {
      console.error("Failed to select image", error);
      alert("Failed to select image. Please try again.");
      throw new Error("Failed to select image");
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
        like: 0,
        comments: [],
        timestamp: new Date().toISOString(),
      };

      if (onPostCreated) {
        onPostCreated(newPost);
      } else {
        const existingPosts =
          (await localforage.getItem(`posts_${user.id}`)) || [];
        const updatedPosts = [newPost, ...existingPosts];
        await localforage.setItem(`posts_${user.id}`, updatedPosts);
      }
      removeImage();
      setName("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to create Post", error);
      alert("Failed to create post. Please try again.");
      throw new Error("Failed to create post");
    }
    setIsSubmiting(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-gray-50 bg-gray-100 overflow-hidden shadow-sm">
            {user?.image ? (
              <img
                src={`${user.image}`}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-indigo-500 bg-amber-100 hover:cursor-pointer">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col pt-1">
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={`What's on your mind, ${
              (user?.name || user?.firstName || "there").split(" ")[0]
            }?`}
            rows={isExpanded || name || image ? 3 : 1}
            className="w-full bg-transparent text-gray-800 text-lg placeholder-gray-500 focus:outline-none resize-none transition-all duration-300"
            style={{
              minHeight: isExpanded || name || image ? "80px" : "30px",
            }}
          />
          {image && (
            <div className="relative mt-3 mb-2 animate-in fade-in zoom-in-95 duration-200">
              {image.file.type.startsWith("video/") ? (
                <video
                  src={image.url}
                  controls
                  className="w-full max-h-80 rounded-2xl border border-gray-100 shadow-sm"
                />
              ) : (
                <img
                  src={image.url}
                  alt="Preview"
                  className="w-full max-h-80 object-cover rounded-2xl border border-gray-100 shadow-sm"
                />
              )}
              <Button
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Remove image"
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          )}
          {isExpanded && (
            <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex gap-1 md:gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  onChange={handleImageChange}
                  className="flex items-center gap-2 px-1 py-1 rounded-xl bg-gray-100 hover:bg-blue-50 text-blue-600 font-medium text-sm transition-colors"
                >
                  <FontAwesomeIcon icon={faImage} className="text-lg" />
                  <span className="hidden sm:inline">Photo</span>
                </Button>

                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsExpanded(false);
                    removeImage();
                    setName("");
                  }}
                  className="text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={(!name.trim() && !image?.file) || isSubmiting}
                  size="sm"
                  className="px-6 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  {isSubmiting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
