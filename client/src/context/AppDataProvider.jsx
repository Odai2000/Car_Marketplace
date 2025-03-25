import { createContext, useEffect, useState } from "react";
import useConfig from "../hooks/useConfig";
export const AppContext = createContext({});

const AppDataProvider = ({ children }) => {
  const [carSpecsData, setCarSpecsData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [loadingCarSpecs, setLoadingCarSpecs] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const { config } = useConfig();

  useEffect(() => {
    fetch(`${config.serverURL}/data/CarSpecs`, {
      method: "get",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCarSpecsData(data);
        setLoadingCarSpecs(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingCarSpecs(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${config.serverURL}/data/countries`, {
      method: "get",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCountriesData(data);
        setLoadingCountries(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingCountries(false);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        carSpecsData,
        countriesData,

        loadingCarSpecs,
        loadingCountries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppDataProvider;
