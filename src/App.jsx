import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage.jsx";
import CollectionsPage from "./components/pages/CollectionsPage.jsx";
import ProductPage from "./components/pages/ProductPage.jsx";
import MaterialPage from "./components/pages/MaterialPage.jsx";
import BuildAQuePage from "./components/pages/BuildAQuePage.jsx";
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


function App() {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                stacked
                pauseOnHover
                toastClassName="toast-class"
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

                    <Route path="/build-a-que" element={<BuildAQuePage />} />

                    <Route path="/materials/:guid" element={<MaterialPage />} />
                    <Route path="/materials" element={<Navigate to="/" replace />} />

                    {/* 
                        User Pages
                    */}
                    <Route path="/account">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="create-account" element={<CreateAccountPage />} />
                        <Route path="password-reset" element={<PasswordReset />} />

                        <Route element={<UserLayout />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route path="admin" element={<AdminPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </main>
        </>
    );
}

export default App;
