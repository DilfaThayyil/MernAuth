import { Navigate, Outlet } from "react-router-dom"

export default function AdminRoute(){
    const isAdminAuthenticated = localStorage.getItem('admintoken')
    return isAdminAuthenticated ? <Outlet/> : <Navigate to='/admin/login'/>
}