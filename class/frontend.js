import axios from "axios";
const API = "http://localhost:500/api/users"

 const createUser = async () =>{
    const res = await axios.post(API,{
        name: "John Doe",
        email: "john.doe@example.com"
    })
    console.log(res.data);
 };