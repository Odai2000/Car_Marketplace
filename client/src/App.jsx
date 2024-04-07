import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";

import Home from "./components/pages/Home/Home";
import PostCreator from "./components/pages/PostCreator/PostCreator";
import PostSearchResult from "./components/pages/PostSearchResults/PostSearchResult";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="new-post" element={<PostCreator />} />
        <Route path="posts" element={<PostSearchResult />} />
      </Route>
    </Routes>
  );
}

export default App;
