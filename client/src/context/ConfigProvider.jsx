import { createContext,useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({children})=>{
    const [config,setConfig] = useState({
        serverURL:import.meta.env.VITE_SERVER_URL,
        geocodingProviderURL: import.meta.env.VITE_PHOTON_API_URL,
        mapServiceProviderURL: import.meta.env.VITE_OPENSTREET_URL
    });

    return(
        <ConfigContext.Provider value={{config}}>
            {children}
        </ConfigContext.Provider>
    )
}
