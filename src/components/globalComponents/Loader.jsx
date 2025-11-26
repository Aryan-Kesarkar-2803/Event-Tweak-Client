import { useState, useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loader = ({
  size = 80,
  color = "primary",
  texts = ["...Please wait"],
  interval = 2000,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "rgba(0,0,0,0.6)", // fade-out effect
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        transition: "opacity 0.4s ease",
      }}
    >
      <CircularProgress size={size} color={color} />

      <Typography
        variant="body1"
        className="text-base"
        sx={{ mt: 2, color: "#fff", fontWeight: 500 }}
      >
        {texts[index]}
      </Typography>
    </Box>
  );
};

export default Loader;
