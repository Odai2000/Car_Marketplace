import useConfig from "./useConfig";

const useMap = () => {
const {config} = useConfig()

const getMapURL=(coords)=>{
  const url = `${config.mapServiceProviderURL}/#map=17/${coords.latitude}/${coords.longitude}`
  return url
}
  return {getMapURL};
};

export default useMap;
