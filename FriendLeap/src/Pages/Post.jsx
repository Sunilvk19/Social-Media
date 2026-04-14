import { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

function Post({onPostCreated}) {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(false);
  const [name, setName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
     setImage(URL.createObjectURL(file));
    }
  };

  const handleForm = () => {
    setForm((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!image) return;
    const newPost = { id: Date.now(), image: image, name: name, likes: 0, comments: 0 };
    // setPosts([newPost, ...posts]);
    if(onPostCreated){
      onPostCreated(newPost)
    }
    setImage(null);
    setName("");
    setForm(false);
  };

  return (
     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">New Post</h2>
          <Button onClick={handleForm} variant={form ? "ghost" : "primary"} size="sm" className="rounded-full px-4 border-2 border-transparent">
            {form ? "Cancel" : "+ Create"}
          </Button>
        </div>
        {form ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Image Upload Area */}
            <div className="p-1 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl transition-all hover:bg-indigo-50/50">
              {image ? (
                <div className="relative rounded-xl overflow-hidden shadow-sm group">
                  <img src={image} alt="preview" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-medium drop-shadow-md">Image Ready</span>
                  </div>
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur text-gray-700 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="py-8 px-4 text-center">
                  <span className="text-3xl block mb-2">📸</span>
                  <label className="block text-sm font-semibold text-indigo-600 mb-1 cursor-pointer hover:underline">
                    Click to upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            {/* Caption Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Caption</label>
              <textarea
                value={name}
                rows={3}
                placeholder="What's on your mind?..."
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none shadow-inner text-sm"
              />
            </div>
            
            <Button onClick={handleSubmit} className="w-full py-3.5 rounded-xl font-semibold shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all mt-2">
              Share Post
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center opacity-70 p-4">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
               <span className="text-2xl grayscale opacity-50">🖼️</span>
            </div>
            <p className="text-gray-500 text-sm px-4">Click "Create" to share a new moment with your friends.</p>
          </div>
        )}
    </div>
  );
}

export default Post;
