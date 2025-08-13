import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const ProfileContext = createContext();

// Provider Component
export const ProfileProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState("");
  const [userId, setUserId] = useState(null); 

  // Load the profile photo from localStorage when the app starts
  useEffect(() => {
    const storedPhoto = localStorage.getItem("ProfilePhoto");
    if (storedPhoto) setProfilePhoto(storedPhoto);
    getuser();
  }, []);

  // Function to update the profile photo
  const updateProfilePhoto = (newPhotoUrl) => {
    setProfilePhoto(newPhotoUrl);
    localStorage.setItem("ProfilePhoto", newPhotoUrl);
  };

   const getuser = async () => {
    try {
      const URL = "http://localhost:7000"; 
      const res = await axios.get(URL + "/api/refetch", {
        withCredentials: true,
      });
      setUserId(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ProfileContext.Provider value={{ profilePhoto, updateProfilePhoto, userId, setUserId  }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom Hook to Use Profile Context
export const useProfile = () =>  {
  const ctx = useContext(ProfileContext);
  console.log("Profile context:", ctx);
  return ctx;
};
