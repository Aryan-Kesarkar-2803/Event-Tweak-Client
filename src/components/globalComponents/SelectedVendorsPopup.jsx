import { Button, TextareaAutosize } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function SelectedVendorsPopup({ open=false, selectedVendors=[], onClose=()=>{}, setSelectedVendors = ()=>{} }) {
  const [selectedType, setSelectedType] = useState(selectedVendors[0]?.businessType || '');
  const [addInstructionsToggle, setAddInstructionsToggle] = useState(false)
  const [currentVendor, setCurrentVendor] = useState(null);
  const [editable, setEditable] = useState(false);
  const [instruction, setInstruction] = useState('')

  const handleAddInstruction = () =>{
      if(Object.keys(currentVendor || {})?.length > 0 && instruction !== ''){
        let temp = [...selectedVendors];
        let selectedVendorIndex = temp.findIndex(vendor => vendor?.id === currentVendor?.id);
        if(selectedVendorIndex !== -1){
            temp[selectedVendorIndex].instructions = instruction;
            setSelectedVendors(temp);
        }
      }
  }

  useEffect(()=>{
    let tempCurrentVendor = selectedVendors.find(v => v?.businessType === selectedType)
    setCurrentVendor(tempCurrentVendor);
    setInstruction(tempCurrentVendor?.instructions || '')
    setAddInstructionsToggle(false)
    setEditable(false)
  },[selectedType])

  return (
    <>
    {
 open && 
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-2 z-50">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden">

    {/* Left Side */}
    <div className="w-full md:w-1/4 bg-gray-100 p-4 border-b md:border-b-0 md:border-r overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Business Types</h2>
      <div className="h-40 max-h-40 md:max-h-max md:h-auto">
      {selectedVendors.map(v => (
        <div
          key={v.id}
          onClick={() => setSelectedType(v.businessType)}
          className={`cursor-pointer px-3 py-2 rounded-md mb-2 text-sm ${
            selectedType === v.businessType
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`}
        >
          {v.businessType}
        </div>
      ))}
      </div>
    </div>

    {/* Right Side */}
    <div className="flex-1  flex flex-col">
      {/* Content Scrollable */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-96 md:max-h-max ">
        {currentVendor ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <img
                src={currentVendor.profileImageData?.url}
                alt={currentVendor.fullName}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-xl font-semibold">{currentVendor.fullName}</h3>
                <p className="text-gray-500">{currentVendor.phoneNo}</p>
              </div>
            </div>

            <p className="text-gray-700 font-medium">Address:</p>
            <p className="text-sm text-gray-600">
              {currentVendor.address.houseNo}, {currentVendor.address.locality},{" "}
              {currentVendor.address.city}, {currentVendor.address.state} -{" "}
              {currentVendor.address.pinCode}
            </p>

            <p className="font-medium text-gray-700">Services:</p>
            <ul className="list-disc ml-5 text-sm text-gray-600">
              {currentVendor.services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <p className="font-medium text-gray-700">Sample Work:</p>
            <div className="flex gap-4 flex-wrap">
              {currentVendor.sampleWorkData.map((s, i) => (
                <img
                  key={i}
                  src={s.url}
                  alt="sample"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a business type to view vendor details.</p>
        )}
      </div>

        {/* <textarea
            value={instruction || ''}
            onChange={(e) => setInstruction(e.target.value || '')}
            placeholder="Enter instructions here..."
            className={`w-full h-32  border border-slate-300 rounded p-2 resize-none overflow-y-auto ${
              !editable ? "text-gray-400 pointer-events-none" : "pointer-events-auto"
            }`}
          /> */}

          { currentVendor &&
          <textarea
            value={instruction || ''}
            onChange={(e) => setInstruction(e.target.value || '')}
            placeholder="Enter instructions here..."
            readOnly={!editable}
            className={`w-full h-32 border border-slate-300 rounded p-2 resize-none overflow-y-auto ${
              !editable ? "text-gray-500" : ""
            }`}
          />
          }



     
      {/* Close Button fixed at bottom */}
      {
        currentVendor && 
      <div className="p-4 border-t flex justify-end items-center gap-2 ">
        
         
         {
         (currentVendor !== null && !editable) ?
            <button
                onClick={()=>{
                  setAddInstructionsToggle(true)
                  setEditable(true)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded md:w-auto mr-2  self-end"
              >
                Add/Change Instructions
              </button> :

               <button
                onClick={()=>{
                  setAddInstructionsToggle(false)
                  handleAddInstruction()
                  setEditable(false)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded md:w-auto self-end"
              >
                Save
              </button>
          }
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded md:w-auto self-end"
        >
          Close
        </button>
      </div>
      }
    </div>

  </div>
</div>

    }
    </>
       
  );
}
