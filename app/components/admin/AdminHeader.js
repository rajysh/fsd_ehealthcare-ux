import React, { useState, useContext } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./AdminHeaderLoggedOut"
import HeaderLoggedIn from "./AdminHeaderLoggedIn"
import StateContext from "../../StateContext"

function AdminHeader(props) {
  const appState = useContext(StateContext)
  const headerContent = appState.isAdminLogin ? <AdminHeaderLoggedIn /> : ""
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {" "}
            E-HealthCare{" "}
          </Link>
        </h4>
        {!props.staticEmpty ? headerContent : ""}
      </div>
    </header>
  )
}
export default AdminHeader
