import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
  const { auth, persist } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  useEffect(() => {
    let isMounted = true;
    console.log("mounted");
    const verifyLogin = async () => {
      try {
        await refresh();
        console.log("User logged in successfuly");
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyLogin() : setIsLoading(false);

    return () => (isMounted = false);
  }, [isLoading]);

  return (
    <>
      {!persist ? <Outlet /> : !isLoading ? <Outlet /> : <div>Loading...</div>}
    </>
  );
};

export default PersistLogin;
