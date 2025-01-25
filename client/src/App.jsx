import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./components/pages/Home/Home";
import PostCreator from "./components/pages/PostCreator/PostCreator";
import PostSearchResult from "./components/pages/PostSearchResults/PostSearchResult";
import AuthProvider from "./context/AuthProvider";
import AppDataProvider from "./context/AppDataProvider";
import PersistLogin from "./components/persistLogin";
import ReqAuth from "./components/ReqAuth";
import UnAuthorized from "./components/pages/UnAuthorized/UnAuthorized";
import UserAccount from "./components/pages/UserAccountPage/UserAccount";
import Chat from "./components/Chat/Chat";

function App() {
  return (
    <AppDataProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route element={<PersistLogin />}>
              <Route index element={<Home />} />
              <Route path="posts" element={<PostSearchResult />} />

              <Route element={<ReqAuth allowedRoles={["USER"]} />}>
                <Route path="me/*" element={<UserAccount />} />
                <Route path="new-post" element={<PostCreator />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            </Route>

            <Route path="unAuthorized" element={<UnAuthorized />} />
          </Route>
        </Routes>
      </AuthProvider>
    </AppDataProvider>
  );
}

export default App;
