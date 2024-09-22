// import { useState, useEffect } from "react"
import { redirect } from "react-router-dom"

export async function requireAuth(request) {
    // fake auth
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const { loggedIn, userType } = authData;
    const pathname = new URL(request.url).pathname
    if (!loggedIn) {
        throw redirect(`/login?message=You must be logged in as a host&redirectTo=${pathname}`)
    }

    if (userType === "host") {
        return null
    } else if (userType === "renter") {
        throw redirect('/unauthorized')
    }

    return null
}

export function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

export function isWithinLast30Days(obj, dateAttributeName) {
    const currentDate = new Date();
    const last30Days = new Date(currentDate);
    last30Days.setDate(currentDate.getDate() - 30);

    const objDate = new Date(obj[dateAttributeName]);

    return objDate >= last30Days && objDate <= currentDate;
}