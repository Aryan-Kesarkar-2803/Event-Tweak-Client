import React, { useState } from "react";
import { deleteUserAccount } from "../utils/repository/user";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import { successNotification } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useAtom(authUserAtom);
  const navigate = useNavigate();

  const handleSignOut = async() => {
    
    const res = await deleteUserAccount(user?.userDetails?.id || '');
    if(res && res?.status == 200){
      successNotification({message:'Signned out'});
      setOpen(false);
      navigate('/')
      setUser({});
      setAuthUser({})
    }

    
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Sign Out
      </button>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl shadow-md w-80 text-center">
            <h2 className="text-lg font-medium mb-4">Are you sure?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Do you really want to sign out?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
