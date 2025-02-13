import { createContext,useContext,useState } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({children})=>{
    const [config,setConfig] = useState({
        serverUrl:import.meta.env.VITE_SERVER_URL
    });

    return(
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = ()=>{
    return useContext(ConfigContext);
}
