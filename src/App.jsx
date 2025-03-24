import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage.jsx";
import CollectionsPage from "./components/pages/CollectionsPage.jsx";
import ProductPage from "./components/pages/ProductPage.jsx";
import MaterialPage from "./components/pages/MaterialPage.jsx";
import BuildACuePage from "./components/pages/BuildACuePage.jsx";
import NotFoundPage from "./components/pages/NotFoundPage.jsx";
import LoginPage from "./components/pages/user/LogInPage.jsx";
import CreateAccountPage from "./components/pages/user/CreateAccountPage.jsx";
import ProfilePage from "./components/pages/user/ProfilePage.jsx";
import SettingsPage from "./components/pages/user/SettingsPage.jsx";
import PasswordReset from "./components/pages/user/PasswordReset.jsx";

import UserLayout from "./components/pages/user/UserLayout.jsx";

import "./css/fontawesome/fontawesome.css";
import "./css/fontawesome/brands.css";
import "./css/fontawesome/solid.css";
import "react-toastify/dist/ReactToastify.css";
import OrdersPage from "./components/pages/user/OrdersPage.jsx";
import AdminPage from "./components/pages/user/AdminPage.jsx";
import { checkAuth } from "./util/requests.js";
import { updateUser } from "./util/redux/actionCreators.js";

const GuestRoute = () => {
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);
    const location = useLocation();
    
    if (isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }}/>;
    }
    
    return <Outlet />;
};


const AuthRoute = () => {
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);
    const location = useLocation();
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    
    return <Outlet />;
};

const AdminRoute = () => {
    const user = useSelector(state => state.user);
    const isAuthenticated = !!user?.authenticated;
    const isAdmin = user?.role === "Admin";
    const location = useLocation();

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

function App() {
    // ping for user auth on mount and on focus
    useEffect(() => {
        const checkUserAuth = () => {
            checkAuth()
                .then((response) => {
                    updateUser({
                        ...response.data,
                    });
                })
                .catch(error => {
                    console.error("Authentication check failed:", error);
                    updateUser({ authenticated: false });
                });
        };
        
        checkUserAuth();

        const handleFocus = () => checkUserAuth();
        window.addEventListener('focus', handleFocus);
        
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                stacked
                pauseOnHover
                toastClassName="toast-class"
                className="toast-body-class"
            />
            <main className="jmiller-app">
                <Header />
                <Routes>
                    {/* 
                        Main Shop Pages
                    */}
                    <Route path="/" element={<HomePage />} />

                    <Route path="/collections">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="available" element={<CollectionsPage />} />
                        <Route path="coming-soon" element={<CollectionsPage />} />
                        <Route path="materials" element={<CollectionsPage />} />
                    </Route>

                    <Route path="/products/:guid" element={<ProductPage />} />
                    <Route path="/products" element={<Navigate to="/" replace />} />

                    <Route path="/build-a-cue" element={<BuildACuePage />} />

                    <Route path="/materials/:guid" element={<MaterialPage />} />
                    <Route path="/materials" element={<Navigate to="/" replace />} />

                    {/* 
                        User Pages
                    */}
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/create-account" element={<CreateAccountPage />} />
                        <Route path="/password-reset" element={<PasswordReset />} />
                    </Route>
                    <Route path="/account" element={<UserLayout />}>
                        <Route element={<AuthRoute />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="orders" element={<OrdersPage />} />
                        </Route>
                        <Route element={<AdminRoute />}>
                            <Route path="admin" element={<AdminPage />} />
                        </Route>
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </main>
        </>
    );
}

export default App;
