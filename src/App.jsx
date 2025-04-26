import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { checkUserAuth } from "./util/functions.js";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage.jsx";
import CollectionsPage from "./components/pages/CollectionsPage.jsx";
import ProductPage from "./components/pages/ProductPage.jsx";
import BuildACuePage from "./components/pages/BuildACuePage.jsx";
import NotFoundPage from "./components/pages/NotFoundPage.jsx";
import LoginPage from "./components/pages/user/LogInPage.jsx";
import CreateAccountPage from "./components/pages/user/CreateAccountPage.jsx";
import ProfilePage from "./components/pages/user/ProfilePage.jsx";
import SettingsPage from "./components/pages/user/SettingsPage.jsx";
import PasswordReset from "./components/pages/user/PasswordReset.jsx";
import ContactPage from "./components/pages/ContactPage.jsx"

import UserLayout from "./components/pages/user/UserLayout.jsx";

import "./css/fontawesome/fontawesome.css";
import "./css/fontawesome/brands.css";
import "./css/fontawesome/solid.css";
import "react-toastify/dist/ReactToastify.css";
import OrdersPage from "./components/pages/user/OrdersPage.jsx";
import AdminPage from "./components/pages/user/AdminPage.jsx";
import SearchPage from "./components/pages/SearchPage.jsx";

const GuestRoute = () => {
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);
    const location = useLocation();
    
    if (isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }}/>;
    }
    
    return <Outlet />;
};


const AuthRoute = () => {
    const user = useSelector(state => state.user);
    const isAuthenticated = !!user?.authenticated;
    const initialAuthChecked = user?.initialAuthChecked;
    const location = useLocation();

    if (!initialAuthChecked) return null;
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    
    return <Outlet />;
};

const AdminRoute = () => {
    const user = useSelector(state => state.user);
    const isAuthenticated = !!user?.authenticated;
    const initialAuthChecked = user?.initialAuthChecked;
    const isAdmin = user.isAdmin;
    const location = useLocation();

    if (!initialAuthChecked) return null;

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

function App() {
    // ping for user auth on mount
    useEffect(() => {
        checkUserAuth();
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
                        <Route path="cues" element={<CollectionsPage />} />
                        <Route path="accessories" element={<CollectionsPage />} />
                        <Route path="materials" element={<CollectionsPage />} />
                        <Route path="search" element={<CollectionsPage />} />
                    </Route>

                    <Route path="/products/:guid" element={<ProductPage />} />

                    <Route path="/build-a-cue" element={<BuildACuePage />} />

                    

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

                    {/* 
                        Other Pages
                    */}
                    <Route path="/pages">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="contact" element={<ContactPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </main>
        </>
    );
}

export default App;
