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
import UserSettings from "./components/pages/UserSettings/userSettings";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import { ConfigProvider } from "./context/configProvider";

function App() {
  return (
    <ConfigProvider>
      <AppDataProvider>
        <AuthProvider>
          <Routes>
            <Route path="/">
              <Route path="user/:_id/verify-email" element={<EmailVerification />} />
              <Route element={<PersistLogin />}>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="posts" element={<PostSearchResult />} />

                  <Route element={<ReqAuth allowedRoles={["USER"]} />}>
                    <Route path="new-post" element={<PostCreator />} />
                  </Route>
                </Route>

                <Route>
                  <Route element={<ReqAuth allowedRoles={["USER"]} />}>
                    <Route path="me" element={<UserAccount />} />
                    <Route path="me/settings" element={<UserSettings />} />
                    <Route path="chat" element={<Chat />} />
                  </Route>
                </Route>
              </Route>

              <Route path="unAuthorized" element={<UnAuthorized />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AppDataProvider>
    </ConfigProvider>
  );
}

export default App;
