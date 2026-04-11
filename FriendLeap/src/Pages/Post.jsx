import { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

function Post() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(false);
  const [name, setName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleForm = () => {
    setForm((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!image) return;
    const newPost = { image, name, id: Date.now() };
    setPosts([newPost, ...posts]);
    setImage(null);
    setName("");
    setForm(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-gray-50 font-sans">
      {/* Left Sidebar - Create Post */}
      <div className="w-full md:w-1/3 lg:w-1/4 min-w-[320px] max-w-sm border-r border-gray-200 p-6 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.02)] z-10 flex flex-col h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
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
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mt-10">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
               <span className="text-3xl grayscale opacity-50">🖼️</span>
            </div>
            <p className="text-gray-500 text-sm px-4">Click "Create" to share a new moment with your friends.</p>
          </div>
        )}
      </div>

      {/* Right Content - Feed */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-8 pb-32 pt-4">
          
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">No posts yet</h3>
              <p className="text-gray-500">Be the first to share something amazing!</p>
            </div>
          ) : (
             posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
                {/* Header */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                    U
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">User Name</h4>
                    <p className="text-xs text-gray-400">Just now</p>
                  </div>
                </div>
                
                {/* Image */}
                {post.image && (
                  <div className="w-full bg-gray-50 overflow-hidden border-y border-gray-50">
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full h-auto max-h-[600px] object-cover"
                    />
                  </div>
                )}
                
                {/* Caption / Footer */}
                <div className="p-5">
                  <p className="text-gray-800 text-sm leading-relaxed">
                     <span className="font-bold text-gray-900 mr-2">User Name</span>
                     {post.name || "Just sharing a moment ✨"}
                  </p>
                  
                  {/* Interaction Buttons Layout */}
                  <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-50 text-gray-500 text-sm font-medium">
                     <button className="hover:text-red-500 transition-colors flex items-center gap-1.5 focus:outline-none">
                        <span className="text-lg">♡</span> Like
                     </button>
                     <button className="hover:text-blue-500 transition-colors flex items-center gap-1.5 focus:outline-none">
                        <span className="text-lg">💬</span> Comment
                     </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
