import { toast } from "react-toastify"


export const successNotification = ({
  title = "",
  message = "",
  duration = 1000,
  zIndex = 9999
}) => {
   const isMobileView = window.innerWidth <= 768
  return toast.success(
    <div>
      {title && <strong>{title}</strong>}
      <div>{message}</div>
    </div>,
    {
      position: isMobileView? "top-right": "bottom-right",
      autoClose: duration,
      style: { 
        zIndex,
        minHeight: "auto",
        maxWidth:'320px',
        width:'70%',
        
      },
    }
  );
};

export const errorNotification = ({
  title = "",
  message = "",
  duration = 1000,
  zIndex = 9999
}) => {
   const isMobileView = window.innerWidth <= 768
  return toast.error(
    <div>
      {title && <strong>{title}</strong>}
      <div>{message}</div>
    </div>,
    {
      position: isMobileView? "top-right": "bottom-right",
      autoClose: duration,
      style: { 
        zIndex,
        minHeight: "auto",
        maxWidth:'320px',
        width:'70%',
        
      },
    }
  );
};

export const alertNotification = ({
  title = "",
  message = "",
  duration = 1000,
  zIndex = 9999
}) => {
   const isMobileView = window.innerWidth <= 768
  return toast.warn(
    <div>
      {title && <strong>{title}</strong>}
      <div>{message}</div>
    </div>,
    {
      position: isMobileView? "top-right": "bottom-right",
      autoClose: duration,
      style: { 
        zIndex,
        minHeight: "auto",
        maxWidth:'320px',
        width:'70%',
        
      },
    }
  );
};