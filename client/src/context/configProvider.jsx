import { createContext,useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({children})=>{
    const [config,setConfig] = useState({
        serverUrl:import.meta.env.VITE_SERVER_URL
    });

    return(
        <ConfigContext.Provider value={{config}}>
            {children}
        </ConfigContext.Provider>
    )
}
