import React, { useState } from "react";
import Button from "../common/Button";

const CreatePost = ({ onPostCreated }) => {
    const [image, setImage] = useState(null);
    const [form, setForm] = useState(false);
    const [name, setName] = useState("");
  return (
    <div>
      <Button>Create Post</Button>
    </div>
  );
};

export default CreatePost;
