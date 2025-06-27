import useConfig from "./useConfig";

const useMap = () => {
  const { config } = useConfig();

  const getMapURL = (coords) => {
    const url = `${config.mapServiceProviderURL}/#map=17/${coords.latitude}/${coords.longitude}`;
    return url;
  };

  // for embedded, bruh
  const getEmbeddedMapURL = (coords) => {
    const bbox = [
      coords.longitude - 0.01, // left
      coords.latitude - 0.01, // bottom
      coords.longitude + 0.01, // right
      coords.latitude + 0.01, // top
    ].join(",");
    const url = `${config.mapServiceProviderURL}/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.latitude},${coords.longitude}`;
    return url;
  };
  return { getMapURL,getEmbeddedMapURL };
};

export default useMap;
