import React from "react";
import { Dialog, IconButton } from "@mui/material";
import { IoCloseCircleOutline, } from "react-icons/io5";
// import CloseIcon from "@mui/icons-material/Close";
import { CgCloseR } from "react-icons/cg";


const ImagePopup = ({ open, onClose, src, alt = "Image" }) => {
return (
<Dialog
open={open}
onClose={onClose}
maxWidth="md"
PaperProps={{
sx: { position: "relative", borderRadius: 4, overflow: "hidden" },
}}
>
<IconButton
onClick={onClose}
sx={{
position: "absolute",
top: 8,
right: 8,
bgcolor: "white",
"&:hover": { bgcolor: "grey.200" },
}}
>
< CgCloseR color="black" /> </IconButton>
<img
src={src}
alt={alt}
style={{ maxWidth: "90vw", maxHeight: "80vh", display: "block" }}
/> </Dialog>
);
};

export default ImagePopup;
