import axios from "axios";


const baseUrl = import.meta.env.VITE_BASE_URL;


export const postRequest = async({headers={},url, data }) =>{
    
    const token = JSON.parse(localStorage.getItem('user'))?.token || "";
    try{
        const isFormData =  data instanceof FormData;

        const response = await axios.post(`${baseUrl}${url}`,data,{
            method:'POST',
            headers:{
                Authorization:`Bearer ${token}`,
                ...headers,
                ... isFormData ? {} :  {'Content-Type':'application/json'},
            }
        })
        return response?.data;
    }catch(e){
        console.error('Error - ',e);
        return e?.response?.data;
    }
}

export const getRequest = async({headers={},url, params }) => {
     const token = JSON.parse(localStorage.getItem('user'))?.token || "";
    try{
        const response = await axios.get(`${baseUrl}${url}`,{
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`,
                ...headers
            },
            params:{
                ...params
            }
        })
        return response?.data;
    }catch(e){
        console.error('Error - ',e.message);
        return e?.response|| {}
    }
}

export const deleteRequest = async({headers={},url, params }) =>{
     const token = JSON.parse(localStorage.getItem('user'))?.token || "";
    try{
        const response = await axios.delete(`${baseUrl}/${url}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`,
                ...headers
            },
            params:{
                ...params
            }
        })

        return response;
    }catch(e){
        console.error('Error - ',e.message);
        return {
            status:'Error occurred'
        }
    }
}