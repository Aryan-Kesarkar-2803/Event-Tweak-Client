// VenueCard.jsx
import { Card, CardContent, CardMedia, Typography, Button, Checkbox } from "@mui/material";

export default function VenueCard({ venue, onClick,eventData, handlerSelectVenue=()=>{},handlerDeselectVenue=()=>{} }) {
  return (
    <Card
      className=" hover:shadow-lg transition-all duration-300 rounded-3xl  border max-h-96 max-w-96 "
    >
      <CardMedia
        component="img"
        style={{
          maxHeight:"384px",
          maxWidth:"384px",
        }}
        image={venue.sampleWorkData[0]?.url}
        // image={venue.profileImageData?.url}
        alt={venue?.venueName || ''}
        className="rounded-t-2xl"
      />
      <CardContent sx={{display:'flex',justifyContent:'space-between'}} >
        <div className="flex-col flex gap-1">
        <Typography variant="h6" className="font-bold text-blue-700">
          {venue?.venueName || ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {venue?.address?.area || ''}, {venue?.address?.city || ''}
        </Typography>
        <Typography variant="body2" className="mt-2">
          Guest Capacity: {venue?.guestCapacity || ''}
        </Typography>
        <Button 
        variant="outlined" 
        size="small" 
        className="mt-3 text-blue-700 border-blue-700"
        onClick={onClick}
        >
          View Details
        </Button>
        </div>
        <Checkbox 
        size="medium" 
        sx={{alignSelf:'end'}} 
        checked={venue?.id === eventData?.venue}
        onClick={()=>{
            if(venue?.id === eventData?.venue ){
                handlerDeselectVenue()
            }else{
                handlerSelectVenue(venue)
            }
          }
        }
        />
      </CardContent>
    </Card>
  );
}
