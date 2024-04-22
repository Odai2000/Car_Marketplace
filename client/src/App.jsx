import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./components/pages/Home/Home";
import PostCreator from "./components/pages/PostCreator/PostCreator";
import PostSearchResult from "./components/pages/PostSearchResults/PostSearchResult";
import { createContext, useState, useEffect } from "react";
export const AppContext = createContext({});

function App() {
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

  return (
    <AppContext.Provider value={{carSpecsData,loading}}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="new-post" element={<PostCreator />} />
          <Route path="posts" element={<PostSearchResult />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
