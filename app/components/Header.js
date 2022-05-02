import React, { useState, useContext } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header(props) {
  const appState = useContext(StateContext)
  // const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : !appState.isAdminLogin ? <HeaderLoggedOut /> : ""
  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : !appState.isAdminLogin ? <HeaderLoggedOut /> : ""
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
export default Header
