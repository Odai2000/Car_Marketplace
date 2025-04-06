import useAuth from "./useAuth";
import useConfig from "./useConfig";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { config } = useConfig();

  const refresh = async () => {
    await fetch(`${config.serverURL}/user/token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAuth((prev) => {
          return {
            ...prev,
            accessToken: data.accessToken,
            roles: data.userData.roles,
            userData:data.userData
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return refresh;
};

export default useRefreshToken;
