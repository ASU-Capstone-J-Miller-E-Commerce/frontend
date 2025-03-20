import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../../util/requests";
import { updateUser } from "../../../util/redux/actionCreators";
import { receiveResponse } from "../../../util/notifications";

export default function UserLayout() {
    const user = useSelector(state => state.user);
    const isAdmin = user?.role === "Admin";

    const handleLogout = () => {
        logout()
            .then((res) => {
                receiveResponse(res);
                dispatch(updateUser({
                    authenticated: false,
                    email: null,
                    firstName: null,
                    lastName: null,
                    role: null
                }));
            })
    };

    return (
        <div className="user-layout">
            <div className="user-drawer-menu open">
                <nav className="user-nav">
                    <ul className="user-nav-list">
                        <li className="user-nav-item">
                            <NavLink to="/account/profile">Profile</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/account/settings">Settings</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/account/orders">Orders</NavLink>
                        </li>
                        {isAdmin && <li className="user-nav-item">
                            <NavLink to="/account/admin">Admin</NavLink>
                        </li>}
                        <li className="user-nav-item">
                            <a href="/" onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}>Logout</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <Outlet />
        </div>
    );
}