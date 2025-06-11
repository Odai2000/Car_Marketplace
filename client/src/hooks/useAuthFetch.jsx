import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAuthFetch = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() <= payload.exp * 1000;
    } catch {
      return false;
    }
  };

  const authFetch = async (url, options = {}) => {
    let accessToken = auth?.accessToken;

    if (!isTokenValid(accessToken)) {
      accessToken = await refresh();
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
     accessToken= await refresh();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return res;
  };

  return authFetch;
};

export default useAuthFetch;
