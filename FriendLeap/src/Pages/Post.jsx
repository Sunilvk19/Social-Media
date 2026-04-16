import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import localforage from "localforage";

function Post({ onPostCreated }) {
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(false);
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    localforage.getItem("user").then((user)=>{
      setUser(user);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleForm = () => {
    setForm((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!image) return;
    if (!user) return;

    const newPost = {
      id: Date.now(),
      image: image,
      name: user.name,
      likes: 0,
      comments: 0,
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    localforage.getItem("posts").then((posts)=>{
      const updated = posts ? [...posts, newPost] : [newPost];
      localforage.setItem("posts", updated);
    })
    
    setImage(null);
    setName("");
    setForm(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
          New Post
        </h2>
        <Button
          onClick={handleForm}
          variant={form ? "ghost" : "primary"}
          size="sm"
          className="rounded-full px-4 border-2 border-transparent"
        >
          {form ? "Cancel" : "+ Create"}
        </Button>
      </div>
      {form ? (
        <div className="flex flex-col gap-5 border-t border-gray-100 pt-5 mt-2">
          <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 p-2 text-center">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow hover:bg-gray-100"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="py-8">
                <label className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">
                  Click to upload an image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Accepts JPG or PNG</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              value={name}
              rows={3}
              placeholder="What's on your mind?"
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Publish Post
          </Button>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">
          Click the button above to share a new moment.
        </div>
      )}
    </div>
  );
}

export default Post;
