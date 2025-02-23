import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="user-layout">
            <div className="user-drawer-menu open">
                <nav className="user-nav">
                    <ul className="user-nav-list">
                        <li className="user-nav-item">
                            <NavLink to="/account/profile" activeClassName="active">Profile</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/account/settings" activeClassName="active">Settings</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/account/orders" activeClassName="active">Orders</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/account/admin" activeClassName="active">Admin</NavLink>
                        </li>
                        <li className="user-nav-item">
                            <NavLink to="/" activeClassName="active">Logout</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="user-content">
                <Outlet />
            </div>
        </div>
    );
}