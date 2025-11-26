export const isNumber = (value) => { return /^\d*$/.test(value)}

export const formatDateToDDMMYY = (dateString) => {
  
  if(dateString === null || dateString === undefined || dateString === '') return;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [year, month, day] = dateString.split("-");
  return `${day}-${months[parseInt(month) - 1]}-${year}`;
};

export const formatTimeTo12Hr = (timeString ="HH:MM") => {
  if(timeString == null || timeString== undefined || timeString === "")return;


  let [hours, minutes] = timeString.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 -> 12
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

