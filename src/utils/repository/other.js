import { deleteImagesFromCloudEndPoint, verifyTokenEndpoint } from "../apiNames/other";
import { getRequest, postRequest } from "../networks/server";
import { errorNotification } from "../toast";

export const firstRequest = async() => {
        const response = await getRequest({
            url:verifyTokenEndpoint,
        })

        if(response?.status == 401){
            return false;
        }else{
           return true
        }
}

export const deleteImagesFromCloud = async(publicIds) => { // array of public Ids
    try{
        const response = await postRequest({
            url:deleteImagesFromCloudEndPoint,
            data: publicIds || {}
        })
        if(response?.status != 200){
            errorNotification({message:response?.message})
        }
        return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Somthing went wrong'
        })
        return false;
    }
}