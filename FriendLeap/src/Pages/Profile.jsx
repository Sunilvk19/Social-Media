import localforage from 'localforage';
import React, { useEffect, useState } from 'react'

const Profile = () => {
    const [user, setUser] = useState(null);
    useEffect(()=>{
        localforage.getItem("user").then((currentUser) =>{
            setUser(currentUser);
        });
        localforage.getItem("posts").then((posts)=>{
            const users = posts.filter((post) => post.user.email === user.email)
            console.log(users);
        })
    }, []);
  return (
    <div>
        <h1 className='text-3xl font-bold'>{user ? user.name : "Loading......"}'s Profile</h1>
    </div>
  )
}

export default Profile;