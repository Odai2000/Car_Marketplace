import useAuth from "./useAuth";
import useConfig from "./useConfig";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { config } = useConfig();

  const refresh = async () => {
    const response = await fetch(`${config.serverURL}/user/token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.log(error);
    });

    const data = await response.json();
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: data.accessToken,
        roles: data.userData.roles,
        userData: data.userData,
      };
    });

    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
