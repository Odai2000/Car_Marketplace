import { createContext,useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({children})=>{
    const [config,setConfig] = useState({
        serverURL:import.meta.env.VITE_SERVER_URL,
        geocodingProviderURL: import.meta.env.VITE_PHOTON_API_URL,
        mapServiceProviderURL: import.meta.env.VITE_OPENSTREET_URL,
        commentLimit:import.meta.env.VITE_COMMENT_LIMIT,
        notificationLimit:import.meta.env.VITE_NOTIFICATION_LIMIT,
        smBreakpoint:400,
        mdBreakpoint:768,
    });

    return(
        <ConfigContext.Provider value={{config}}>
            {children}
        </ConfigContext.Provider>
    )
}
