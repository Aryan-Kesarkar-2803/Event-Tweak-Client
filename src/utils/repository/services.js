import { cancelServiceBookingEndpoint, deleteServiceRequestEndpoint, getAllServiceBookingsForClientEndpoint, getAllServiceBookingsForVendorEndpoint, getAllServiceRequestsForClientEndpoint, getAllServiceRequestsForVendorEndpoint, requestVendorServiceEndpoint, saveServiceBookingEndpoint, updateServiceRequestForClientEndpoint } from "../apiNames/services";
import { getRequest, postRequest } from "../networks/server";
import { errorNotification } from "../toast";

export const requestVendorService = async(data) => {
    try{
        const response = await postRequest({
            url:requestVendorServiceEndpoint,
            data: data || {}
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

export const getAllServiceRequestsForClient = async(clientId) => {
    try{
        const response = await getRequest({
            url:getAllServiceRequestsForClientEndpoint,
            params:{
                clientId:clientId
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
export const getAllServiceRequestsForVendor = async(vendorId = "") => {
    try{
        const response = await getRequest({
            url:getAllServiceRequestsForVendorEndpoint,
            params:{
                vendorId:vendorId
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

export const updateServiceRequestForClient = async(serviceBookingRequestId='', vendorObj={}) => {
    try{
        const response = await postRequest({
            url: updateServiceRequestForClientEndpoint,
            data:{
                vendorObj: vendorObj,
                serviceBookingRequestId: serviceBookingRequestId,
            } || {}
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
        console.error(e)
        return false;
    }
}
export const saveServiceBooking = async(data) => {
    try{
        const response = await postRequest({
            url: saveServiceBookingEndpoint,
            data: data || {},
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
        console.error(e)
        return false;
    }
}

export const deleteServiceRequest = async(serviceRequestId = "") => {
    try{
        const response = await getRequest({
            url:deleteServiceRequestEndpoint,
            params:{
                serviceRequestId:serviceRequestId || '',
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
export const getAllServiceBookingsForClient = async(clientId = "") => {
    try{
        const response = await getRequest({
            url: getAllServiceBookingsForClientEndpoint,
            params:{
                clientId:clientId
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
export const getAllServiceBookingsForVendor = async(vendorId = "") => {
    try{
        const response = await getRequest({
            url:getAllServiceBookingsForVendorEndpoint,
            params:{
                vendorId:vendorId
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

export const cancelServiceBooking = async(serviceBookingId = "") => {
    try{
        const response = await getRequest({
            url: cancelServiceBookingEndpoint,
            params:{
                serviceBookingId: serviceBookingId || ''
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



