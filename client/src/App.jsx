import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./components/pages/Home/Home";
import PostForm from "./components/pages/PostForm/PostForm";
import PostSearchResult from "./components/pages/PostSearchResults/PostSearchResult";
import AuthProvider from "./context/AuthProvider";
import AppDataProvider from "./context/AppDataProvider";
import PersistLogin from "./components/PersistLogin";
import { ToastProvider } from "./context/ToastProvider";
import ReqAuth from "./components/ReqAuth";
import UnAuthorized from "./components/pages/UnAuthorized/UnAuthorized";
import UserAccount from "./components/pages/UserAccountPage/UserAccount";
import Chat from "./components/pages/Chat/Chat";
import UserSettings from "./components/pages/UserSettings/UserSettings";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import { ConfigProvider } from "./context/ConfigProvider";
import PostPage from "./components/pages/PostPage/PostPage";
import { useEffect } from "react";
import { AuthModalProvider } from "./context/AuthModalProvider";
import { DialogProvider } from "./context/DialogProvider";

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };
  return (
    <ConfigProvider>
      <AppDataProvider>
        <AuthProvider>
          <ToastProvider>
            <AuthModalProvider>
              <DialogProvider>
                <ScrollToTop />
                <Routes>
                  <Route path="/">
                    <Route element={<PersistLogin />}>
                      <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="posts" element={<PostSearchResult />} />
                        <Route path="post/:_id" element={<PostPage />} />
                        <Route path="user/:_id/" element={<UserAccount />} />
                        <Route
                          path="user/:_id/verify-email"
                          element={<EmailVerification />}
                        />

                        <Route element={<ReqAuth allowedRoles={["USER"]} />}>
                          <Route path="new" element={<PostForm />} />
                          <Route
                            path="edit"
                            element={<PostForm isUpdating={true} />}
                          />
                          <Route path="me" element={<UserAccount />} />
                        </Route>
                      </Route>

                      <Route>
                        <Route element={<ReqAuth allowedRoles={["USER"]} />}>
                          <Route
                            path="me/settings"
                            element={<UserSettings />}
                          />
                          <Route path="chat" element={<Chat />} />
                          <Route path="chat/:peer_id" element={<Chat />} />
                        </Route>
                      </Route>
                    </Route>

                    <Route path="unAuthorized" element={<UnAuthorized />} />
                  </Route>
                </Routes>
              </DialogProvider>
            </AuthModalProvider>
          </ToastProvider>
        </AuthProvider>
      </AppDataProvider>
    </ConfigProvider>
  );
}

export default App;
