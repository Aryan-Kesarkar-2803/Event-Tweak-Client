import { alertNotification, errorNotification } from "./toast";

export const uploadSingleImage = async (e) => {
    const file = e.target.files[0];

    if(!file){
        errorNotification({message:"select valid file"});
        return null;
    }

    if(file?.size > 1 * 1024 * 1024){
        alertNotification({message:'select file less than 1mb'})
        return null;
    }

    const formData = new FormData();
    formData.append("file",file);
    formData.append("upload_preset","single_image_upload");
    formData.append('cloud_name',"dxsfxnjyx");
    
    try{
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/dxsfxnjyx/image/upload`,
            {
                method:'POST',
                body:formData
            }
        )
        const data = res.json();
        return data;
    }catch(err){
        errorNotification({message:'Something went wrong'});
        return false;
    }
}  