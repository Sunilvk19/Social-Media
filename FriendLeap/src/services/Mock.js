import { BASE_URL, END_POINTS } from "../utility/Api";
import axios from "axios";

export const getMockUsers = async () => {
    const url = `${BASE_URL}${END_POINTS.GET_USER}?limit=100`; 
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.error("API Error: ", err);
        throw new Error("Failed to fetch users");
    }
    
};

export const getMockPosts = async (id) => {
    const url = id ? `${BASE_URL}${END_POINTS.GET_POSTS}/${id}` : `${BASE_URL}${END_POINTS.GET_POSTS}`;
    try{
        const res = await axios.get(url);
        return res.data;
    } catch(err){
        console.error("API Error: ", err);
        throw new Error("Failed to fetch posts");
    }
};


export const searchByUsers = async (query) => {
    const url = `${BASE_URL}${END_POINTS.SEARCH_USER}/search?q=${query}`;
    try{
        const res = await axios.get(url);
        return res.data;
    }catch(err){
        console.error("API Error: ",err);
        throw new Error("Failed to search users");
    }
}

export const searchPosts = async (query) => {
    const url = `${BASE_URL}${END_POINTS.GET_POSTS}/search?q=${query}`;
    try{
        const res = await axios.get(url);
        return res.data;
    }catch(err){
        console.error("API Error: ", err);
        throw new Error("Failed to search posts");
    }
}