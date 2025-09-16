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
import CueProductPage from "./components/pages/CueProductPage.jsx";
import AccessoryProductPage from "./components/pages/AccessoryProductPage.jsx";
import BuildACuePage from "./components/pages/BuildACuePage.jsx";
import NotFoundPage from "./components/pages/NotFoundPage.jsx";
import LoginPage from "./components/pages/user/LogInPage.jsx";
import CreateAccountPage from "./components/pages/user/CreateAccountPage.jsx";
import ProfilePage from "./components/pages/user/ProfilePage.jsx";
import SettingsPage from "./components/pages/user/SettingsPage.jsx";
import PasswordReset from "./components/pages/user/PasswordReset.jsx";
import ContactUsPage from "./components/pages/ContactUsPage.jsx";
import FAQPage from "./components/pages/FAQPage.jsx";
import AboutUsPage from "./components/pages/AboutUsPage.jsx";
import CartPage from "./components/pages/CartPage.jsx";
import CheckoutSuccessPage from "./components/pages/CheckoutSuccessPage.jsx";
import CheckoutCancelPage from "./components/pages/CheckoutCancelPage.jsx";
import CheckoutFailurePage from "./components/pages/CheckoutFailurePage.jsx";
import OrdersPage from "./components/pages/user/OrdersPage.jsx";
import OrderDetailPage from "./components/pages/user/OrderDetailPage.jsx";
import ReferencesPage from "./components/pages/ReferencesPage.jsx";
import AdminPage from "./components/pages/user/AdminPage.jsx";

import UserLayout from "./components/pages/user/UserLayout.jsx";
import MaterialDialog from "./components/dialogs/MaterialDialog.jsx";

import "./css/fontawesome/fontawesome.css";
import "./css/fontawesome/brands.css";
import "./css/fontawesome/solid.css";
import "./css/cart.css";
import "react-toastify/dist/ReactToastify.css";


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
            />
            <MaterialDialog />
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
                    
                    <Route path="/cues/:guid" element={<CueProductPage />} />
                    <Route path="/accessories/:guid" element={<AccessoryProductPage />} />

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
                            <Route path="orders/:orderId" element={<OrderDetailPage />} />
                        </Route>
                        <Route element={<AdminRoute />}>
                            <Route path="admin" element={<AdminPage />} />
                        </Route>
                        <Route index element={<Navigate to="/" replace />} />
                    </Route>
                    <Route element={<AuthRoute />}>
                        <Route path="/cart" element={<CartPage />} />
                    </Route>

                    {/* 
                        Checkout Pages
                    */}
                    <Route path="/checkout">
                        <Route path="success" element={<CheckoutSuccessPage />} />
                        <Route path="cancel" element={<CheckoutCancelPage />} />
                        <Route path="failure" element={<CheckoutFailurePage />} />
                    </Route>

                    {/* 
                        Other Pages
                    */}
                    <Route path="/pages">
                        <Route index element={<Navigate to="/" replace />} />
                        <Route path="contact-us" element={<ContactUsPage />} />
                        <Route path="references" element={<ReferencesPage />} />
                        <Route path="faq" element={<FAQPage />} />
                        <Route path="about-us" element={<AboutUsPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </main>
        </>
    );
}

export default App;
