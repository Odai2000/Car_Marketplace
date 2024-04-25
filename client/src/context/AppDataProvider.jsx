import { createContext, useEffect, useState } from "react";

export const AppContext = createContext({})

const AppDataProvider =({children})=>{
    const [carSpecsData, setCarSpecsData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch("http://localhost:8080/data/CarSpecs", {
        method: "get",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCarSpecsData(data);
          setLoading(false)
        })
        .catch((error) => {
          console.log(error);
          setLoading(false)
        });
    }, []);

    return(
        <AppContext.Provider value={{carSpecsData,loading}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppDataProvider