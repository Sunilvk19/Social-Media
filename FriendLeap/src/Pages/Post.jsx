import { useState } from 'react';

function Post() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(false);
  const [name, setName] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleForm = () => {
    setForm((prev) => !prev);
  };

  const handleSubmit = () => {
    if (!image) return;
    const newPost = { image, id: Date.now() };
    setPosts([newPost, ...posts]);
    setImage(null);
    setForm(false);
  };

  return (
    <div id='post'>
      <h2> Upload post </h2>
      <div>
        <button onClick={handleForm}>Create</button>

        {form && (
          <div className="post">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="preview" width="200" />}
            <input
              type="textarea"
              style={{ width: '200px' }}
              value={name}
              placeholder="Caption...."
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSubmit}> Post </button>
          </div>
        )}
      </div>

      <div>
        {(posts.length ? posts : posts).map((post) => (
          <div key={post.id} className="posts">
            <h3>
              {' '}
              <b> Name </b>
            </h3>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={{ width: '300px', height: '200px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
