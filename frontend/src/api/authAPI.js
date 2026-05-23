import axios from "axios"

export const registerUser = async (data)=>{
    const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        data
    )
    return response.data;
};