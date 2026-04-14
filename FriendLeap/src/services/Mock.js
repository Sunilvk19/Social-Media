import { BASE_URL, END_POINTS } from "../utility/Api";
import axios from "axios";

export const getMockUsers = async () => {
    const url = `${BASE_URL}${END_POINTS.GET_USER}`; 
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.error("API Error: ", err);
        throw err;
    }
    
};