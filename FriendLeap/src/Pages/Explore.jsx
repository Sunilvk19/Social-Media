import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { getMockPosts } from "../services/Mock";
import Input from "../components/common/Input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockPosts= await getMockPosts();
      
        if (mockPosts?.posts) setPosts(mockPosts.posts);
      } catch (error) {
        console.log(error.message);
        throw new Error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredPosts = query
    ? posts.filter((post) => {
        const title = post.title.toLowerCase();
        const body = post.body.toLowerCase();
        return title.includes(query) || body.includes(query);
      })
    : posts;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64 text-xl font-bold text-gray-400 animate-pulse">
          Loading Content...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
      
        <div className="flex justify-start">
            <button 
              onClick={() => navigate("/home")} 
              className="text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:text-indigo-600 transition-all font-bold uppercase tracking-widest text-xs shadow-sm"
            >
              ← Back to Home
            </button>
        </div>
        
          <div className="relative max-w-xl mx-auto mb-6">
            <Input
              icon={faMagnifyingGlass}
              type="text"
              placeholder="Search people, posts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 drop-shadow-sm">
              Trending Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {post.body}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                      {post.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1">
                        👍 {post.reactions?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        👁️ {post.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Explore;
