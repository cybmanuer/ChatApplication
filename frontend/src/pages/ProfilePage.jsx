


import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User ,Edit2,Check,X} from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  
  // --- new states for editing name ---
  const [isEditingName, setIsEditingName] = useState(false);  //the state is handeled here only , not in useAuthStore.js
  const [fullName, setFullName] = useState(authUser?.fullName || "");

  const handleSaveName = () => {
  if (!fullName.trim()) {
    toast.error("Name cannot be empty");
    return;
  }
  updateProfile({ fullName: fullName });
  setIsEditingName(false);
};

  const constimg = "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };





  // ---------
  const { deleteAccount, isDeleting } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await deleteAccount();
    setIsOpen(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
{/* commentd */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                // src={selectedImg || authUser.profilePic || "../src/assets/avatar.png"}
                src={selectedImg || authUser.profilePic || constimg}

                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
{/* 
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <pen></pen>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div> */}

 {/* Full Name section with edit */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>

              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-base-200 rounded-lg border outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isUpdatingProfile}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setFullName(authUser?.fullName || "");
                      setIsEditingName(false);
                    }}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-2.5 bg-base-200 rounded-lg border">
                  <span>{authUser?.fullName}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 hover:bg-base-300 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between py-2 ">
                <span>Delete Account</span>
                <span className="text-sm text-gray-500">This action cannot be undone</span>
                {/* Delete button */}
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => setIsOpen(true)}
                >Delete
                </button>

                {/* Modal */}
                {isOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
                      <h2 className="text-xl font-semibold text-red-600 mb-2">
                        ⚠️ Are you absolutely sure?
                      </h2>
                      <p className="text-gray-600 mb-6">
                        This will permanently delete your account and all related data
                        (messages, files, and activity). <br />
                        This action <strong>cannot be undone</strong>.
                      </p>

                      {/* Buttons */}
                      <div className="flex justify-end gap-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => setIsOpen(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-error"
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete Anyway"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
};
export default ProfilePage;