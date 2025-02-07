import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    await fetch("http://localhost:8080/user/token", {
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
        console.log("Refreshed: ", auth);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return refresh;
};

export default useRefreshToken;
