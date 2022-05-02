import React, { useContext, useEffect, useState } from "react"
import Page from "../Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../../DispatchContext"

function HomeGuest() {
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    firstname: {
      value: "",
      hasErrors: false,
      message: ""
    },
    lastname: {
      value: "",
      hasErrors: false,
      message: ""
    },
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
      case "firstnameImmediately":
        draft.firstname.hasErrors = false
        draft.firstname.value = action.value
        if (draft.firstname.value.length > 30) {
          draft.firstname.hasErrors = true
          draft.firstname.message = "First name cannot exceed 30 characters"
        }
        if (draft.firstname.value && !/^([a-zA-Z\s]+)$/.test(draft.firstname.value)) {
          draft.firstname.hasErrors = true
          draft.firstname.message = "First name can only contain letters"
        }
        return
      case "firstnameAfterDelay":
        if (draft.firstname.value.length < 3) {
          draft.firstname.hasErrors = true
          draft.firstname.message = "First name must have atleast 3 characters"
        }
        // if (!draft.firstname.hasErrors && !action.noRequest) {
        //   draft.firstname.checkCount++
        // }
        return
      case "lastnameImmediately":
        draft.lastname.hasErrors = false
        draft.lastname.value = action.value
        if (draft.lastname.value.length > 30) {
          draft.lastname.hasErrors = true
          draft.lastname.message = "Last name cannot exceed 30 characters"
        }
        if (draft.lastname.value && !/^([a-zA-Z\s]+)$/.test(draft.lastname.value)) {
          draft.lastname.hasErrors = true
          draft.lastname.message = "Last name can only contain letters"
        }
        return
      case "lastnameAfterDelay":
        if (draft.lastname.value.length < 3) {
          draft.lastname.hasErrors = true
          draft.lastname.message = "Last name must have atleast 3 characters"
        }
        // if (!draft.lastname.hasErrors && !action.noRequest) {
        //   draft.lastname.checkCount++
        // }
        return
      // case "usernameUniqueResults":
      //   if (action.value) {
      //     draft.username.hasErrors = true
      //     draft.username.isUnique = false
      //     draft.username.message = "Username entered is already taken"
      //     draft.username.isUnique = true
      //   } else {
      //     draft.username.isUnique = true
      //   }
      //   return
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
    if (state.firstname.value) {
      const delay = setTimeout(() => dispatch({ type: "firstnameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.firstname.value])

  useEffect(() => {
    if (state.lastname.value) {
      const delay = setTimeout(() => dispatch({ type: "lastnameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.lastname.value])

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

  // useEffect(() => {
  //   if (state.username.checkCount) {
  //     //send axios request here
  //     const ourRequest = Axios.CancelToken.source()
  //     async function fetchResults() {
  //       try {
  //         const response = await Axios.get("/admin/getallmedicine", { username: state.username.value }, { cancelToken: ourRequest.token })
  //         dispatch({ type: "usernameUniqueResults", value: response.data })
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     }
  //     fetchResults()

  //     return () => ourRequest.cancel()
  //   }
  // }, [state.username.checkCount])

  useEffect(() => {
    if (state.email.checkCount) {
      //send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          console.log(`${Axios.defaults.baseURL}/user/findUser/${state.email.value}`)
          const response = await Axios.get(`/user/findUser/${state.email.value}`, { cancelToken: ourRequest.token })
          dispatch({ type: "emailUniqueResults", value: response.data })
        } catch (e) {
          console.log(e)
        }
      }
      fetchResults()

      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      //send axios request here
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/user/signup", { firstname: state.firstname.value, lastname: state.lastname.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
          appDispatch({ type: "login", data: response.data })
          appDispatch({ type: "flashMessage", value: "Congrats, to your new account." })
        } catch (e) {
          console.log(e)
        }
      }
      fetchResults()

      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()

    dispatch({ type: "firstnameImmediately", value: state.firstname.value })
    dispatch({ type: "firstnameAfterDelay", value: state.firstname.value, noRequest: true })
    dispatch({ type: "lastnameImmediately", value: state.lastname.value })
    dispatch({ type: "lastnameAfterDelay", value: state.lastname.value, noRequest: true })
    dispatch({ type: "emailImmediately", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value })
    dispatch({ type: "submitForm" })

    // try {
    //   await Axios.post("/register", { username, email, password })
    //   console.log("User registration successfully created!!")
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Register as User here?</h1>
          {/* <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p> */}
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstname-register" className="text-muted mb-1">
                <small>First Name</small>
              </label>
              {/* <input onChange={e => setUsername(e.target.value)} */}

              <input onChange={e => dispatch({ type: "firstnameImmediately", value: e.target.value })} id="firstname-register" name="firstname" className="form-control" type="text" placeholder="Enter first name" autoComplete="off" />
              <CSSTransition in={state.firstname.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.firstname.message}</div>
              </CSSTransition>
            </div>

            <div className="form-group">
              <label htmlFor="lastname-register" className="text-muted mb-1">
                <small>Last Name</small>
              </label>
              {/* <input onChange={e => setUsername(e.target.value)} */}

              <input onChange={e => dispatch({ type: "lastnameImmediately", value: e.target.value })} id="lastname-register" name="lastname" className="form-control" type="text" placeholder="Enter last name" autoComplete="off" />
              <CSSTransition in={state.lastname.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.lastname.message}</div>
              </CSSTransition>
            </div>

            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for EhealthCare
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
