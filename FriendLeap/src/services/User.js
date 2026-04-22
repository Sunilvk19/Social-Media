import axios from "axios";

export const getRealUsers = async () => {
    try{
        const res = await axios.get("http://localhost:5000/users");
        return res.data;
    }
    catch(error){
        return error;
    }
  
};