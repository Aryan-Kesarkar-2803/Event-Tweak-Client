import { getRequest, postRequest } from "../networks/server";
import { errorNotification } from "../toast";
import { getBookingRequestsForVendorEndpoint, getVendorProfileEndpoint, getVendorsByIdsEndpoint, getVendorsEndPoint, loginVendorEndpoint, registerVendorEndpoint, updateBookingRequestStatusForVendorEndpoint, updateServiceRequestStatusForVendorEndpoint, updateVendorProfileEndpoint } from "../apiNames/vendor";

export const updateVendorProfile = async(data) => {
    try{
        const response = await postRequest({
            url:updateVendorProfileEndpoint,
            data:data || {}
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

export const getVendorProfile = async() => {
    try{
        const response = await getRequest({
            url:getVendorProfileEndpoint
        })
        if(response?.status != 200){
            errorNotification({message:response?.message})
        }
        
        return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }
}

export const registerVendor = async(data) => {
    try{
        const response = await postRequest({
            url:registerVendorEndpoint,
            data:data || {}
        })
       return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }
}

export const loginVendor = async(data) => {
    try{
        const response = await postRequest({
            url:loginVendorEndpoint,
            data:data || {}
        })
        if(response?.status == 200){
            const token = response?.data?.token || "";
            return response;
        }else{
            console.log('Error - ',response?.message)
            return response;
        }
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }

}

export const getVendors = async(state="",city="",businessType="") => {
    try{
        const response = await getRequest({
            url:getVendorsEndPoint,
            params:{
                state: state,
                city: city,
                businessType: businessType
            }
        })
        if(response?.status != 200){
            errorNotification({message:response?.message})
        }
        
        return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }
}

export const getVendorsByIds = async(data) => {
    try{
        const response = await postRequest({
            url:getVendorsByIdsEndpoint,
            data:data || {}
        })
       return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }
}
export const updateBookingRequestStatusForVendor = async(data) => {
    try{
        const response = await postRequest({
            url:updateBookingRequestStatusForVendorEndpoint,
            data:data || {}
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
export const updateServiceRequestStatusForVendor = async(data) => {
    try{
        const response = await postRequest({
            url:updateServiceRequestStatusForVendorEndpoint,
            data:data || {}
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
export const getBookingRequestForVendor = async(vendorId = '') => {
    try{
        const response = await getRequest({
            url:getBookingRequestsForVendorEndpoint,
            params:{
                vendorId: vendorId,
            }
        })
        if(response?.status != 200){
            errorNotification({message:response?.message})
        }
        
        return response;
    }catch(e){
        errorNotification({
            title: 'Error',
            message:'Something went wrong'
        })
        return false;
    }
}