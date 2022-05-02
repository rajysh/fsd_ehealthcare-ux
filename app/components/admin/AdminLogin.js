import React, { useContext, useEffect, useState } from "react"
import Page from "../Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../../DispatchContext"

function AdminLogin() {
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()
  const appDispatch = useContext(DispatchContext)
  const [email, setemail] = useState()
  const [password, setPassword] = useState()

  const initialState = {
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provied a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "Email entered is already taken"
          draft.email.isUnique = true
        } else {
          draft.email.isUnique = true
        }
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 30) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 30 characters."
        }
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 6) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be atleast 6 characters."
        }
        return
      case "submitForm":
        console.log(!draft.firstname.hasErrors && !draft.lastname.hasErrors && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors)
        if (!draft.firstname.hasErrors && !draft.lastname.hasErrors && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          console.log("submit")
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    appDispatch({ type: "adminPage" })
    console.log("admin page")
  }, [])

  // useEffect(() => {
  //   if (state.email.checkCount) {
  //     //send axios request here
  //     const ourRequest = Axios.CancelToken.source()
  //     async function fetchResults() {
  //       try {
  //         console.log(`${Axios.defaults.baseURL}/user/findUser/${state.email.value}`)
  //         const response = await Axios.get(`/user/findUser/${state.email.value}`, { cancelToken: ourRequest.token })
  //         dispatch({ type: "emailUniqueResults", value: response.data })
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     }
  //     fetchResults()

  //     return () => ourRequest.cancel()
  //   }
  // }, [state.email.checkCount])

  // const { setLoggedIn } = useContext(ExampleContext)
  //  const appDispatch = useContext(DispatchContext)

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
        if (response.data.isAdmin) {
          appDispatch({ type: "adminLogin", data: response.data })
          appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
        } else {
          appDispatch({ type: "flashMessage", value: "You do not have admin permission" })
          //console.log("Incorrect email and password.")
        }
      } else {
        appDispatch({ type: "flashMessage", value: "Invalid email or password." })
        //console.log("Incorrect email and password.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // function handleSubmit(e) {
  //   e.preventDefault()

  //   dispatch({ type: "emailImmediately", value: state.email.value })
  //   dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
  //   dispatch({ type: "passwordImmediately", value: state.password.value })
  //   dispatch({ type: "passwordAfterDelay", value: state.password.value })
  //   dispatch({ type: "submitForm" })

  //   // try {
  //   //   await Axios.post("/register", { username, email, password })
  //   //   console.log("User registration successfully created!!")
  //   // } catch (error) {
  //   //   console.log(error)
  //   // }
  // }

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          {/* <h1 className="display-3">Admin Login</h1> */}
          {/* <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p> */}
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <h3 className="display-3">Admin Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => setemail(e.target.value)} name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => setPassword(e.target.value)} name="password" className="form-control" type="password" placeholder="Enter your password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default AdminLogin
