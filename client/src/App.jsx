import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./components/pages/Home/Home";
import PostCreator from "./components/pages/PostCreator/PostCreator";
import PostSearchResult from "./components/pages/PostSearchResults/PostSearchResult";

import AuthProvider from "./context/AuthProvider";
import AppDataProvider from "./context/AppDataProvider";

function App() {
  return (
    <AppDataProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="new-post" element={<PostCreator />} />
            <Route path="posts" element={<PostSearchResult />} />
          </Route>
        </Routes>
      </AuthProvider>
    </AppDataProvider>
  );
}

export default App;
