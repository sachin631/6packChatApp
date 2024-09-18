import axios from "axios"

const axios_client=axios.create({
    baseURL:"http://localhost:5050/api/v1",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axios_client