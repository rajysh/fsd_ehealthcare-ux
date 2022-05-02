import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedOut(props) {
  // const { setLoggedIn } = useContext(ExampleContext)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const [email, setemail] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/user/login", { email, password })
      if (response.data) {
        //console.log(response.data)
        // localStorage.setItem("complexappToken", response.data.token)
        // localStorage.setItem("complexappemail", response.data.email)
        // localStorage.setItem("complexappAvatar", response.data.avatar)
        //setLoggedIn(true)
        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
      } else {
        appDispatch({ type: "flashMessage", value: "Invalid email or password." })
        //console.log("Incorrect email and password.")
      }
    } catch (error) {
      appDispatch({ type: "flashMessage", value: "Invalid email or password." })
      console.log(error)
    }
  }

  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />

  return (
    <>
      {!appState.isAdminPage && (
        <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
          <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={e => setemail(e.target.value)} name="email" className="form-control form-control-sm input-dark" type="text" placeholder="email" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Sign In</button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default HeaderLoggedOut
