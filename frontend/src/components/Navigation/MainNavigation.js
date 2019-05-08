import React from 'react';
import { NavLink } from 'react-router-dom';

const mainNavigation = props => (
    <header>
        <div className="main-navigation__logo">
            <h1> BookIt </h1>
        </div>
        <nav className="main-navigation__items">
            <ul> 
                <li> 
                    <NavLink to="/auth"> Auth </NavLink>

                </li>
                <li> 
                    <NavLink to="/events"> Events </NavLink>                
                </li>
                <li> 
                    <NavLink to="/bookings"> Bookings </NavLink>                
                </li>
            </ul>
        </nav>
    </header>
);

export default mainNavigation;