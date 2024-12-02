// import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isUserLoggedIn } from "../hooks";


export const PrivateRoute = () => {
    const isLoggedIn = isUserLoggedIn();


    return isLoggedIn  ? <Outlet /> : <Navigate to="/signin" />;
  
}
