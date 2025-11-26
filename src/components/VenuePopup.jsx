import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
} from "@mui/material";

export default function VenuePopup({ open, handleClose, venue, handlerSelectVenue=()=>{}, handlerDeselectVenue=()=>{}, eventData }) {
  if (!venue) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ className: "rounded-2xl" }}
    >
      <DialogTitle className="text-xl font-bold text-blue-700">
        {venue.venueName}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <img
              src={venue.sampleWorkData?.[0]?.url || venue.profileImageData?.url}
              alt={venue.venueName}
              className="rounded-lg w-full h-64 object-cover"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className="font-semibold text-gray-700 mb-2">
              📍 {venue.address.area}, {venue.address.city}, {venue.address.state}
            </Typography>
            <Typography>👤 {venue.coordinatorName}</Typography>
            <Typography>📞 {venue.phoneNo}</Typography>
            <Typography>📧 {venue.email}</Typography>
            <Typography className="mt-2">
              🧍‍♂️ Guest Capacity: <b>{venue.guestCapacity}</b>
            </Typography>
            <Typography>
              💰 Charges/Day: <b>₹{venue.chargesPerDay}</b>
            </Typography>

            <Box className="mt-3">
              <Typography className="font-semibold">Services:</Typography>
              <Box className="flex flex-wrap gap-1 mt-1">
                {venue.services?.map((s, i) => (
                  <Chip key={i} label={s} size="small" color="primary" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box className="mt-3">
              <Typography className="font-semibold">Amenities:</Typography>
              <Box className="flex flex-wrap gap-1 mt-1">
                {venue.amenities?.map((a, i) => (
                  <Chip key={i} label={a} size="small" color="success" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Sample work gallery */}
        <Box className="mt-4">
          <Typography className="font-semibold mb-2">Sample Work:</Typography>
          <Box className="flex gap-2 overflow-x-auto">
            {venue.sampleWorkData?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`work-${i}`}
                className="rounded-lg h-32 w-48 object-cover"
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
            {
              eventData?.venue === venue?.id ?
              <Button
                onClick={()=>{
                  handlerDeselectVenue();
                  handleClose();
                }}
                variant="contained"
                // className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                UnSelect
              </Button>:
               <Button
              onClick={()=>{
                handlerSelectVenue(venue)
                handleClose()
              }}
              variant="contained"
              // className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Select
            </Button>
            }
        

        <Button
          onClick={handleClose}
          variant="contained"
          // className="  text-white rounded-lg"
          sx={{backgroundColor:'red'}}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
