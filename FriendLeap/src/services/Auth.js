import axios from "axios";
import bcrypt from "bcryptjs";
import localforage, { config } from "localforage";

const generateId = () => {
    // return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    return crypto.randomUUID();
};

const CACHE_TTL = 5 * 60 * 1000;
const getCacheKey = (config) => {
    return `${config.url}?.${JSON.stringify(config.params || {})}`
}

const API = axios.create({
     baseURL: "http://localhost:5000",
     headers: {
        "content-type" : "application/json",
    }
});
API.interceptors.request.use(async (config)=>{
    if( config.method !== "get" || !config.cache ) return config;

    const key = getCacheKey(config);
    const cached = await localforage.getItem(key);
    console.log(cached)
    if(cached){
        const { data, expiry } = cached;
        if(expiry > Date.now()){
            return Promise.reject({
                isCached: true,
                data,
            });
        }else{
            await localforage.removeItem(key);
        }
    }
    return config;
});

API.interceptors.response.use( async (response)=>{
    const { config } = response;
    if(config.method === "get" && config.cache ){
        const key = getCacheKey(config);

        await localforage.setItem(key, {
            data: response.data,
            expiry: Date.now() + CACHE_TTL,
        });
    }
    return response;
},
    async (error) => {
        if(error.isCached){
            return Promise.resolve({
                data: error.data,
            })
        }
        return Promise.reject(error);
    }
);

export const handleRegister = async (formData) => {
    try {
        const checkUsers = await API.get("/users", { params: { email: formData.email}});
        if(checkUsers.data.length > 0){
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(formData.password, salt);
        
        const finalData = { ...formData, id: generateId() , password: hash };
        
        const response = await API.post("/users", finalData);
        const saveToUser = { ...response.data }
        delete saveToUser.password;
        await localforage.setItem("user", JSON.stringify(saveToUser));
        return saveToUser;
    } catch (error) {
        console.log(error.message);
        throw new Error("Failed to register");
    }
}

export const handleLogin = async (email, password) => {
    try {
        const response = await API.get("/users", { params: { email }});
        if(response.data.length === 0) {
            throw new Error("No user found with this email");
        }
        
        const user = response.data[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Password");
        }
        const userToSave = { ...user };
        delete userToSave.password;
        await localforage.setItem("user", JSON.stringify(userToSave))
        return user;
    } catch (error) {
        if (error.message === "No user found with this email" || error.message === "Invalid Password") {
            throw new Error( error.message);
        }
        throw new Error("Failed to login");
    }
}

export const handleLogout = async () => {
   await localforage.removeItem("user");
   await localforage.removeItem("Current_user");
}