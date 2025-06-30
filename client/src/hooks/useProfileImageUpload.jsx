import { Profiler, useState } from "react";
import useAuthFetch from "./useAuthFetch";
import useConfig from "./useConfig";
import useAuth from "./useAuth";

function useProfileImageUpload(user_id, autoSubmit) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const authFetch = useAuthFetch();
  const { config } = useConfig();
  const { auth,setAuth } = useAuth;

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setSuccess(false);

    if (autoSubmit && selectedFile) {
      setTimeout(async () => {
        await handleSubmit();
      }, 0);
    }
  };
  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      const response = await authFetch(
        `${config?.serverURL}/user/${user_id}/profile-image`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");
      const url = await response.json()

      setAuth({...auth,userData:{...auth?.userData,profileImageUrl:url}})
      setSuccess(true);
    } catch (error) {
      console.error(error); onClick={() => {
    // Reset input to allow same file selection
    if (imageInput.current) {
      imageInput.current.value = '';
    }
    imageInput.current.click();
  }}
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    loading,
    success,
    handleChange,
    handleSubmit,
    acceptString: "image/jpeg, image/png, image/webp",
  };
}

export default useProfileImageUpload;
