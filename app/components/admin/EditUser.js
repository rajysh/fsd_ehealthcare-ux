import React, { useContext, useEffect, phonetate } from "react"
import { useImmerReducer } from "use-immer"
import { useParams, Link, useNavigate } from "react-router-dom"
// import "react-datetime/css/react-datetime.css"
import Page from "../Page"
import Axios from "axios"
import LoadingDotsIcon from "../LoadingDotsIcon"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import NotFound from "../NotFound"
import DatePicker from "react-datetime"
import moment from "moment"

function EditUser() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState = {
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
      message: ""
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isadmin: {
      value: "",
      hasErrors: false,
      message: ""
    },
    dateofbirth: {
      value: "",
      hasErrors: false,
      message: ""
    },
    phone: {
      value: "",
      hasErrors: false,
      message: ""
    },
    address: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.firstname.value = action.value.firstName
        draft.lastname.value = action.value.lastName
        draft.email.value = action.value.email
        draft.password.value = action.value.password
        draft.isadmin.value = action.value.isAdmin
        draft.dateofbirth.value = action.value.dateOfBirth
        draft.phone.value = action.value.phone
        draft.address.value = action.value.address
        draft.isFetching = false
        return
      case "firstnameChange":
        draft.firstname.hasErrors = false
        draft.firstname.value = action.value
        return
      case "lastnameChange":
        draft.lastname.hasErrors = false
        draft.lastname.value = action.value
        return
      case "emailChange":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "passwordChange":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "isadminChange":
        draft.isadmin.hasErrors = false
        draft.isadmin.value = action.value
        return
      case "dateofbirthChange":
        draft.dateofbirth.hasErrors = false
        draft.dateofbirth.value = action.value
        return
      case "phoneChange":
        draft.phone.hasErrors = false
        draft.phone.value = action.value
        return
      case "addressChange":
        draft.address.hasErrors = false
        draft.address.value = action.value
        return
      case "submitRequest":
        console.log(!draft.firstname.hasErrors && !draft.lastName.hasErrors && !draft.email.hasErrors && !draft.password.hasErrors && !draft.dateofbirth.hasErrors && !draft.phone.hasErrors && !draft.address.hasErrors)
        if (!draft.firstname.hasErrors && !draft.lastName.hasErrors && !draft.email.hasErrors && !draft.password.hasErrors && !draft.dateofbirth.hasErrors && !draft.phone.hasErrors && !draft.address.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestCompleted":
        draft.isSaving = false
        return
      case "firstnameRules":
        if (!action.value.trim()) {
          draft.firstname.hasErrors = true
          draft.firstname.message = "You must provide a first name"
        }
        return
      case "lastnameRules":
        if (!action.value.trim()) {
          draft.lastname.hasErrors = true
          draft.lastname.message = "You must provide Last Name"
        }
        return
      case "emailRules":
        if (!action.value.trim()) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide Email"
        }
        return
      case "passwordRules":
        if (!action.value.trim()) {
          draft.password.hasErrors = true
          draft.password.message = "You must provide Password"
        }
        return
      case "dateofbirthRules":
        if (!action.value.trim()) {
          draft.dateofbirth.hasErrors = true
          draft.dateofbirth.message = "You must provide Date of Birth"
        }
        return
      case "phoneRules":
        if (!action.value.trim()) {
          draft.phone.hasErrors = true
          draft.phone.message = "You must provide Phone"
        }
        return
      case "addressRules":
        if (!action.value.trim()) {
          draft.address.hasErrors = true
          draft.address.message = "You must provide Address"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  // const { id } = useParams()
  // const [isLoading, setIsLoading] = phonetate(true)
  // const [post, setPost] = phonetate()
  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "firstnameRules", value: state.firstname.value })
    dispatch({ type: "lastnameRules", value: state.lastname.value })
    dispatch({ type: "emailRules", value: state.email.value })
    dispatch({ type: "passwordRules", value: state.password.value })
    dispatch({ type: "dateofbirthRules", value: state.dateofbirth.value })
    dispatch({ type: "phoneRules", value: state.phone.value })
    dispatch({ type: "addressRules", value: state.address.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/user/getUser/${state.id}`, { cancelToken: ourRequest.token })
        console.log(response.data)
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          // console.log(appState.user.username)
          console.log(response.data.name)
          //if (appState.user.username != response.data.author.username) {
          // appDispatch({ type: "flashMessage", value: "You do have permission to edit that post!!" })
          //redirect to home page
          //navigate("/")
          //}
        } else {
          dispatch({ type: "notFound", value: response.data })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchPost() {
        try {
          console.log(`/user/editUser/, id: ${state.id}, firstname: ${state.firstname.value}, lastname: ${state.lastname.value}, email: ${state.email.value}, password: ${state.password.value}, isadmin: ${state.isadmin.checked}, dateofbirth: ${state.dateofbirth.value}, phone: ${state.phone.value}, address: ${state.address.value}, token: ${appState.user.token}`)

          const response = await Axios.put(`/user/editUser`, { id: `${state.id}`, firstname: state.firstname.value, lastname: state.lastname.value, email: state.email.value, password: state.password.value, isadmin: state.isadmin.checked, dateofbirth: state.dateofbirth.value, phone: state.phone.value, address: state.address.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          console.log(response.data)
          dispatch({ type: "saveRequestCompleted" })
          appDispatch({ type: "flashMessage", value: "Product was updated." })
          console.log(response.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }
  if (state.isFetching)
    return (
      <Page title="Edit post">
        <LoadingDotsIcon />
      </Page>
    )

  return (
    // const dob  = new Date(user.dateOfBirth).toLocaleDateString()
    <Page title="Edit Product">
      {/* <Link to={`/product/${state.id}`} className="small font-weight-bold"> */}
      <Link to={`/admin/users`} className="small font-weight-bold">
        &laquo; Back to Product
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="product-name" className="text-muted mb-1">
            <small>First Name</small>
          </label>
          <input onBlur={e => dispatch({ type: "firstnameRules", value: e.target.value })} onChange={e => dispatch({ type: "firstnameChange", value: e.target.value })} value={state.firstname.value} autoFocus name="firstname" id="product-firstname" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.firstname.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.firstname.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-lastname" className="text-muted mb-1">
            <small>Last Name</small>
          </label>
          <input onBlur={e => dispatch({ type: "lastnameRules", value: e.target.value })} onChange={e => dispatch({ type: "lastnameChange", value: e.target.value })} value={state.lastname.value} autoFocus name="lastname" id="product-lastname" className="form-control form-control-lg form-control-lastname" type="text" placeholder="" autoComplete="off" />
          {state.lastname.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.lastname.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-email" className="text-muted mb-1">
            <small>Email</small>
          </label>
          <input onBlur={e => dispatch({ type: "emailRules", value: e.target.value })} onChange={e => dispatch({ type: "emailChange", value: e.target.value })} value={state.email.value} autoFocus name="email" id="product-email" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.email.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-password" className="text-muted mb-1">
            <small>Password</small>
          </label>
          <input onBlur={e => dispatch({ type: "passwordRules", value: e.target.value })} onChange={e => dispatch({ type: "passwordChange", value: e.target.value })} value={state.password.value} autoFocus name="password" id="product-password" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.password.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-price" className="text-muted mb-1">
            <small>Price</small>
          </label>
          <input onBlur={e => dispatch({ type: "isadminRules", value: e.target.checked })} onChange={e => dispatch({ type: "isadminChange", value: e.target.checked })} checked={state.isadmin.checked} autoFocus name="isadmin" id="product-isadmin" className="form-control form-control-lg form-control" type="checkbox" placeholder="" autoComplete="off" />
          {state.isadmin.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.isadmin.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-dateofbirth" className="text-muted mb-1">
            <small>Date of Birth</small>
          </label>
          {/* <DatePicker onBlur={e => dispatch({ type: "dateofbirthRules", value: e.target.value })} onChange={e => dispatch({ type: "dateofbirthChange", value: e.target.value })} value={state.dateofbirth.value} autoFocus name="dateofbirth" id="product-dateofbirth" />
          {state.dateofbirth.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.dateofbirth.message}</div>} */}
          <input onBlur={e => dispatch({ type: "dateofbirthRules", value: e.target.value })} onChange={e => dispatch({ type: "dateofbirthChange", value: e.target.value })} value={state.dateofbirth.value} autoFocus name="dateofbirth" id="product-dateofbirth" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-dateofbirth" className="text-muted mb-1">
            <small>Phone</small>
          </label>
          {/* <DatePicker onBlur={e => dispatch({ type: "dateofbirthRules", value: e.target.value })} onChange={e => dispatch({ type: "dateofbirthChange", value: e.target.value })} value={state.dateofbirth.value} autoFocus name="dateofbirth" id="product-dateofbirth" />
          {state.dateofbirth.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.dateofbirth.message}</div>} */}
          <input onBlur={e => dispatch({ type: "phoneRules", value: e.target.value })} onChange={e => dispatch({ type: "phoneChange", value: e.target.value })} value={state.phone.value} autoFocus name="dateofbirth" id="product-dateofbirth" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.phone.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.phone.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-phone" className="text-muted mb-1 d-block">
            <small>Address</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "addressRules", value: e.target.value })} onChange={e => dispatch({ type: "addressChange", value: e.target.value })} value={state.address.value} name="address" id="product-address" className="body-content tall-textarea form-control" type="text"></textarea>
          {state.address.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.address.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Product"}
        </button>

        {/* <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button> */}
      </form>
    </Page>
  )
}

export default EditUser
