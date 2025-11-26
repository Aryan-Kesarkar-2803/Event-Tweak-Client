import {  eventBookingRequestEndPoint, getEventsForVenueEndpoint, saveEventDataEndpoint,getAllEventBookingRequestsForClientEndPoint, rejectVendorByClientEndpoint, addVendorsToBookingRequestEndpoint, updateVenueForBookingRequestEndpoint, getAllEventBookingsForClientEndpoint, getEventsForVendorEndpoint, cancelEventBookingEndpoint } from "../apiNames/event";
import { getRequest, postRequest } from "../networks/server";
import { errorNotification } from "../toast";

export const saveEventData = async(data) => {
    try{
        const response = await postRequest({
            url:saveEventDataEndpoint,
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
export const saveEventBookingRequest = async(data) => {
    try{
        const response = await postRequest({
            url:eventBookingRequestEndPoint,
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

export const getEventsForVenue = async(venueId) => {
    try{
        const response = await getRequest({
            url:getEventsForVenueEndpoint,
            params:{
                venueId:venueId
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
export const getAllEventBookingRequestsForClient = async(clientId) => {
    try{
        const response = await getRequest({
            url:getAllEventBookingRequestsForClientEndPoint,
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
export const rejectVendorByClient = async(vendorId='', requestId = "") => {
    try{
        const response = await getRequest({
            url: rejectVendorByClientEndpoint,
            params:{
                vendorId: vendorId,
                requestId: requestId,
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

export const addVendorsToBookingRequest = async({requestId, vendorsList}) => {
    try{
        const response = await postRequest({
            url:addVendorsToBookingRequestEndpoint,
            data:{
                requestId,
                vendorsList,
            } || {}
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

export const updateVenueForBookingRequest = async(data) => {
    try{
        const response = await postRequest({
            url:updateVenueForBookingRequestEndpoint,
            data:data || {}
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

export const getAllEventBookingsForClient = async(clientId) => {
    try{
        const response = await getRequest({
            url: getAllEventBookingsForClientEndpoint,
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

export const getEventsForVendor = async(vendorId) => {
    try{
        const response = await getRequest({
            url:getEventsForVendorEndpoint,
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
export const cancelEventBooking = async(eventBookingId) => {
    try{
        const response = await getRequest({
            url:cancelEventBookingEndpoint,
            params:{
                eventBookingId: eventBookingId || '',
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

