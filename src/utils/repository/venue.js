import { getBookingRequestsForVenueEndpoint, getVenueByIdEndpoint, getVenueProfileEndpoint, getVenuesEndPoint, loginVenueEndpoint, registerVenueEndpoint, updateBookingRequestForVenueEndpoint, updateVenueProfileEndpoint } from "../apiNames/venue";
import { getRequest, postRequest } from "../networks/server";
import { errorNotification } from "../toast";

export const getVenues = async({city, state,date}) => {
    try{
        const response = await getRequest({
            url:getVenuesEndPoint,
            params:{
                city:city,
                state:state,
                date:date
            }
        })
        if(response?.status != 200){
            errorNotification({message:(response?.message || 'Please Login!')})
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
export const registerVenue = async(data) => {
    try{
        const response = await postRequest({
            url:registerVenueEndpoint,
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
export const loginVenue = async(data) => {
    try{
        const response = await postRequest({
            url:loginVenueEndpoint,
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
export const updateVenueProfile = async(data) => {
    try{
        const response = await postRequest({
            url:updateVenueProfileEndpoint,
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
export const getVenueProfile = async() => {
    try{
        const response = await getRequest({
            url:getVenueProfileEndpoint
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
export const getVenueById = async(venueId = '') => {
    try{
        const response = await getRequest({
            url:getVenueByIdEndpoint,
            params:{
                venueId: venueId,
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
export const getBookingRequestForVenue = async(venueId = '') => {
    try{
        const response = await getRequest({
            url:getBookingRequestsForVenueEndpoint,
            params:{
                venueId: venueId,
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
export const updateBookingRequestStatusForVenue = async(data) => {
    try{
        const response = await postRequest({
            url:updateBookingRequestForVenueEndpoint,
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