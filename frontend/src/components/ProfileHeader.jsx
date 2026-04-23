import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Eye, Upload } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
    const { logout, authUser, updateProfile } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [showProfilePicture, setshowProfilePicture] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                    {/* AVATAR */}
                    <div className="avatar online">
                        <div className="size-14 rounded-full overflow-hidden relative group cursor-pointer">
                            
                            <img
                                src={selectedImg || authUser.profilePic || "/avatar.png"}
                                alt="User image"
                                className="size-full object-cover"
                            />

                            {/* HOVER ACTIONS */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                
                                {/* CHANGE */}
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-1.5 bg-black/60 rounded-full hover:scale-110 transition-transform"
                                    title="Change profile picture"
                                >
                                    <Upload className="size-4 text-white" />
                                </button>

                                {/* VIEW */}
                                <button
                                    onClick={() => setshowProfilePicture(true)}
                                    className="p-1.5 bg-black/60 rounded-full hover:scale-110 transition-transform"
                                    title="View profile picture"
                                >
                                    <Eye className="size-4 text-white" />
                                </button>

                            </div>
                        </div>

                        {/* FILE INPUT */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* USERNAME */}
                    <div>
                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                            {authUser.fullName}
                        </h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex gap-4 items-center">

                    {/* LOGOUT */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={logout}
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    {/* SOUND TOGGLE */}
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={() => {
                            mouseClickSound.currentTime = 0;
                            mouseClickSound.play().catch(() => {});
                            toggleSound();
                        }}
                    >
                        {isSoundEnabled ? (
                            <Volume2Icon className="size-5" />
                        ) : (
                            <VolumeOffIcon className="size-5" />
                        )}
                    </button>

                </div>
            </div>

            {/* VIEW PROFILE PIC MODAL */}
            {showProfilePicture && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setshowProfilePicture(false)}
                >
                    <div
                        className="bg-slate-800 p-6 rounded-lg max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImg || authUser.profilePic || "/avatar.png"}
                            alt="Profile"
                            className="w-full rounded-lg"
                        />

                        <button
                            onClick={() => setshowProfilePicture(false)}
                            className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileHeader;

// import { useState, useRef } from "react";
// import { LogOutIcon, VolumeOffIcon, Volume2Icon, Eye, Upload } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";

// const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

// function ProfileHeader() {
//     const { logout, authUser, updateProfile } = useAuthStore();
//     const { isSoundEnabled, toggleSound } = useChatStore();
//     const [selectedImg, setSelectedImg] = useState(null);
//     const [showProfilePicture, setshowProfilePicture] = useState(false);

//     const fileInputRef = useRef(null);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const reader = new FileReader();
//         reader.readAsDataURL(file);

//         reader.onloadend = async () => {
//         const base64Image = reader.result;
//         setSelectedImg(base64Image);
//         await updateProfile({ profilePic: base64Image });
//         };
//     };

//     return (
//         <div className="p-6 border-b border-slate-700/50">
//         <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//             {/* AVATAR */}
//             <div className="avatar online">
//                 <div className="size-14 rounded-full overflow-hidden relative group cursor-pointer">
//                 <img
//                     src={selectedImg || authUser.profilePic || "/avatar.png"}
//                     alt="User image"
//                     className="size-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
//                     <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
//                     title="Change profile picture"
//                     >
//                     <Upload className="size-4 text-white" />
//                     <span className="text-white text-xs">Change</span>
//                     </button>
//                     <button
//                     onClick={() => setshowProfilePicture(true)}
//                     className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
//                     title="View profile picture"
//                     >
//                     <Eye className="size-4 text-white" />
//                     <span className="text-white text-xs">View</span>
//                     </button>
//                 </div>
//                 </div>

//                 <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageUpload}
//                 className="hidden"
//                 />
//             </div>

//             {/* USERNAME & ONLINE TEXT */}
//             <div>
//                 <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
//                 {authUser.fullName}
//                 </h3>

//                 <p className="text-slate-400 text-xs">Online</p>
//             </div>
//             </div>

//             {/* BUTTONS */}
//             <div className="flex gap-4 items-center">
//             {/* LOGOUT BTN */}
//             <button
//                 className="text-slate-400 hover:text-slate-200 transition-colors"
//                 onClick={logout}
//             >
//                 <LogOutIcon className="size-5" />
//             </button>

//             {/* SOUND TOGGLE BTN */}
//             <button
//                 className="text-slate-400 hover:text-slate-200 transition-colors"
//                 onClick={() => {
//                 // play click sound before toggling
//                 mouseClickSound.currentTime = 0; // reset to start
//                 mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
//                 toggleSound();
//                 }}
//             >
//                 {isSoundEnabled ? (
//                 <Volume2Icon className="size-5" />
//                 ) : (
//                 <VolumeOffIcon className="size-5" />
//                 )}
//             </button>
//             </div>
//         </div>

//         {/* VIEW PROFILE PIC MODAL */}
//         {showProfilePicture && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setshowProfilePicture(false)}>
//             <div className="bg-slate-800 p-6 rounded-lg max-w-sm" onClick={(e) => e.stopPropagation()}>
//                 <img
//                 src={selectedImg || authUser.profilePic || "/avatar.png"}
//                 alt="Profile"
//                 className="w-full rounded-lg"
//                 />
//                 <button
//                 onClick={() => setshowProfilePicture(false)}
//                 className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
//                 >
//                 Close
//                 </button>
//             </div>
//             </div>
//         )}
//         </div>
//     );
// }
// export default ProfileHeader;