import React, { useState, useRef, useEffect } from "react";
import { alertNotification } from "../../utils/toast";

const ImageUpload = ({ maxImages = 5, onChange, allowMultiple = false, disabled=false, reset=false }) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const handleChange = (e) => {
    // const selectedFiles = Array.from(e.target.files);

    const selectedFiles = Array.from(e.target.files).filter(
    (file) => file.size <= 2 * 1024 * 1024
    );

  if (selectedFiles.length < e.target.files.length) {
    alertNotification({message:"Some files were too large (max 2MB) and were not added."});
  }

    const combinedFiles = [...files, ...selectedFiles].slice(0, maxImages);
    setFiles(combinedFiles);
    if (onChange) onChange(combinedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  useEffect(()=>{
    if(reset === true){
      setFiles([])
    }
  },[reset])

  return (
    <div>
      {/* Hidden file input */}
      <input

        type="file"
        accept="image/*"
        multiple={allowMultiple}
        onChange={handleChange}
        disabled={files.length >= maxImages}
        ref={inputRef}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current.click()}
        className={`px-4 py-2  text-white rounded ${disabled? '': ' hover:bg-indigo-600'} ${disabled? 'bg-gray-400':'bg-indigo-500'}`}
      >
        Upload Images
      </button>

      <div className="flex gap-3 mt-3 flex-wrap">
        {files.map((file, idx) => (
          <div key={idx} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
