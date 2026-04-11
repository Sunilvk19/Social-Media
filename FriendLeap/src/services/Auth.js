import axios from "axios";
import bcrypt from "bcryptjs";

const API = axios.create({
     baseURL: "http://localhost:5000",
     headers: {
        "content-type" : "application/json",
    }
});

export const handleRegister = async (formData) => {
    try {
        // bcrypt functions return Promises, so they must be awaited
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(formData.password, salt);
        
        // It's a best practice to create a new object rather than mutating the parameter
        const finalData = { ...formData, password: hash };
        
        const response = await API.post("/users", finalData);
        const saveToUser = { ...response.data }
        delete saveToUser.password;
        localStorage.setItem("user", JSON.stringify(saveToUser));
        return saveToUser;
    } catch (error) {
        throw new Error("Failed to register");
    }
}

export const handleLogin = async (email, password) => {
    try {
        const response = await API.get("/users", { params: { email }});
        if(response.data.length === 0) {
            // Throw an error so the frontend catch block handles it
            throw new Error("No user found with this email");
        }
        
        const user = response.data[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            // Throw an error so the frontend catch block handles it
            throw new Error("Invalid Password");
        }
        const userToSave = { ...user };
        delete userToSave.password;
        localStorage.setItem("user", JSON.stringify(userToSave))
        return user;
    } catch (error) {
        // Rethrow custom errors directly so your UI can display the message
        if (error.message === "No user found with this email" || error.message === "Invalid Password") {
            throw error;
        }
        throw new Error("Failed to login");
    }
}

export const handleLogout = async () => {
    localStorage.removeItem("user");
}