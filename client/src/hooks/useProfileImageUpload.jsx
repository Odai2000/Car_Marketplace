import { useState } from "react";
import useAuthFetch from "./useAuthFetch";
import useConfig from "./useConfig";
import useAuth from "./useAuth";

function useProfileImageUpload(user_id, autoSubmit) {

  const authFetch = useAuthFetch();
  const { config } = useConfig();
  const { auth, setAuth } = useAuth();

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (autoSubmit && selectedFile) {
      await handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (selectedFile) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);



    try {
      const response = await authFetch(
        `${config?.serverURL}/user/${user_id}/profile-image`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      setAuth({
        ...auth,
        userData: { ...auth?.userData, profileImageUrl: data?.profileImageUrl	 },
      });
    } catch (error) {
      console.error(error);
    } 
  };

  return {
    handleChange,
    handleSubmit,
    acceptString: "image/jpeg, image/png, image/webp",
  };
}

export default useProfileImageUpload;
