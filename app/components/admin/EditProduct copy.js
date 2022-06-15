import React, { useContext, useEffect, useState } from "react"
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

function EditProduct() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const originalState = {
    name: {
      value: "",
      hasErrors: false,
      message: ""
    },
    companyName: {
      value: "",
      hasErrors: false,
      message: ""
    },
    price: {
      value: "",
      hasErrors: false,
      message: ""
    },
    quantity: {
      value: "",
      hasErrors: false,
      message: ""
    },
    imageUrl: {
      value: "",
      hasErrors: false,
      message: ""
    },
    uses: {
      value: "",
      hasErrors: false,
      message: ""
    },
    expireDate: {
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
        draft.name.value = action.value.name
        draft.companyName.value = action.value.companyName
        draft.price.value = action.value.price
        draft.quantity.value = action.value.quantity
        draft.imageUrl.value = action.value.imageUrl
        draft.uses.value = action.value.uses
        draft.expireDate.value = action.value.expireDate
        draft.isFetching = false
        return
      case "nameChange":
        draft.name.hasErrors = false
        draft.name.value = action.value
        return
      case "companyNameChange":
        draft.companyName.hasErrors = false
        draft.companyName.value = action.value
        return
      case "imageUrlChange":
        draft.imageUrl.hasErrors = false
        draft.imageUrl.value = action.value
        return
      case "quantityChange":
        draft.quantity.hasErrors = false
        draft.quantity.value = action.value
        return
      case "priceChange":
        draft.price.hasErrors = false
        draft.price.value = action.value
        return
      case "expireDateChange":
        draft.expireDate.hasErrors = false
        draft.expireDate.value = action.value
        return
      case "usesChange":
        draft.uses.hasErrors = false
        draft.uses.value = action.value
        return
      case "submitRequest":
        console.log(!draft.name.hasErrors && !draft.companyName.hasErrors && !draft.imageUrl.hasErrors && !draft.quantity.hasErrors && !draft.price.hasErrors && !draft.expireDate.hasErrors && !draft.uses.hasErrors)
        if (!draft.name.hasErrors && !draft.companyName.hasErrors && !draft.imageUrl.hasErrors && !draft.quantity.hasErrors && !draft.price.hasErrors && !draft.expireDate.hasErrors && !draft.uses.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestCompleted":
        draft.isSaving = false
        return
      case "nameRules":
        if (!action.value.trim()) {
          draft.name.hasErrors = true
          draft.name.message = "You must provide a name"
        }
        return
      case "companyNameRules":
        if (!action.value.trim()) {
          draft.companyName.hasErrors = true
          draft.companyName.message = "You must provide Company Name"
        }
        return
      case "imageUrlRules":
        if (!action.value.trim()) {
          draft.imageUrl.hasErrors = true
          draft.imageUrl.message = "You must provide Image URL"
        }
        return
      case "quantityRules":
        if (!action.value.trim()) {
          draft.quantity.hasErrors = true
          draft.quantity.message = "You must provide Quantity"
        }
        return
      case "priceRules":
        if (!action.value.trim()) {
          draft.price.hasErrors = true
          draft.price.message = "You must provide Price"
        }
        return
      case "expireDateRules":
        if (!action.value.trim()) {
          draft.expireDate.hasErrors = true
          draft.expireDate.message = "You must provide Expire Date"
        }
        return
      case "usesRules":
        if (!action.value.trim()) {
          draft.uses.hasErrors = true
          draft.uses.message = "You must provide Uses"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  // const { id } = useParams()
  // const [isLoading, setIsLoading] = useState(true)
  // const [post, setPost] = useState()
  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "nameRules", value: state.name.value })
    dispatch({ type: "companyNameRules", value: state.companyName.value })
    dispatch({ type: "imageUrlRules", value: state.imageUrl.value })
    dispatch({ type: "quantityRules", value: state.quantity.value })
    dispatch({ type: "priceRules", value: state.price.value })
    dispatch({ type: "expireDateRules", value: state.expireDate.value })
    dispatch({ type: "usesRules", value: state.uses.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/admin/getMedicineById/${state.id}`, { cancelToken: ourRequest.token })
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
          console.log(`${state.id}, name: ${state.name.value}, companyName: ${state.companyName.value}, imageurl: ${state.imageUrl.value}, quantity: ${state.quantity.value}, price: ${state.price.value}, expiredate: ${state.expireDate.value}, uses: ${state.uses.value}, token: ${appState.user.token}`)
          console.log(Axios.put(`/admin/updateMedicine`, { id: `${state.id}`, name: state.name.value, companyName: state.companyName.value, imageUrl: state.imageUrl.value, quantity: state.quantity.value, price: state.price.value, expireDate: state.expireDate.value, uses: state.uses.value, token: appState.user.token }, { cancelToken: ourRequest.token }))
          const response = await Axios.put(`/admin/updateMedicine`, { id: `${state.id}`, name: state.name.value, companyName: state.companyName.value, imageUrl: state.imageUrl.value, quantity: state.quantity.value, price: state.price.value, expireDate: state.expireDate.value, uses: state.uses.value, token: appState.user.token }, { cancelToken: ourRequest.token })
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
    <Page title="Edit Product">
      {/* <Link to={`/product/${state.id}`} className="small font-weight-bold"> */}
      <Link to={`/admin/home`} className="small font-weight-bold">
        &laquo; Back to Product
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="product-name" className="text-muted mb-1">
            <small>Name</small>
          </label>
          <input onBlur={e => dispatch({ type: "nameRules", value: e.target.value })} onChange={e => dispatch({ type: "nameChange", value: e.target.value })} value={state.name.value} autoFocus name="name" id="product-name" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.name.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.name.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-companyname" className="text-muted mb-1">
            <small>Companyname</small>
          </label>
          <input onBlur={e => dispatch({ type: "companyNameRules", value: e.target.value })} onChange={e => dispatch({ type: "companyNameChange", value: e.target.value })} value={state.companyName.value} autoFocus name="companyname" id="product-companyname" className="form-control form-control-lg form-control-companyname" type="text" placeholder="" autoComplete="off" />
          {state.companyName.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.companyName.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-imageurl" className="text-muted mb-1">
            <small>Image URL</small>
          </label>
          <input onBlur={e => dispatch({ type: "imageUrlRules", value: e.target.value })} onChange={e => dispatch({ type: "imageUrlChange", value: e.target.value })} value={state.imageUrl.value} autoFocus name="imageurl" id="product-imageurl" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.imageUrl.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.imageUrl.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-quantity" className="text-muted mb-1">
            <small>Quantity</small>
          </label>
          <input onBlur={e => dispatch({ type: "quantityRules", value: e.target.value })} onChange={e => dispatch({ type: "quantityChange", value: e.target.value })} value={state.quantity.value} autoFocus name="quantity" id="product-quantity" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.quantity.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.quantity.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-price" className="text-muted mb-1">
            <small>Price</small>
          </label>
          <input onBlur={e => dispatch({ type: "priceRules", value: e.target.value })} onChange={e => dispatch({ type: "priceChange", value: e.target.value })} value={state.price.value} autoFocus name="price" id="product-price" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
          {state.price.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.price.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-expiredate" className="text-muted mb-1">
            <small>Expiry Date</small>
          </label>
          {/* <DatePicker onBlur={e => dispatch({ type: "expireDateRules", value: e.target.value })} onChange={e => dispatch({ type: "expireDateChange", value: e.target.value })} value={state.expireDate.value} autoFocus name="expiredate" id="product-expiredate" />
          {state.expireDate.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.expireDate.message}</div>} */}
          <input onBlur={e => dispatch({ type: "expireDateRules", value: e.target.value })} onChange={e => dispatch({ type: "expireDateChange", value: e.target.value })} value={state.expireDate.value} autoFocus name="expiredate" id="product-expiredate" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-uses" className="text-muted mb-1 d-block">
            <small>Uses</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "usesRules", value: e.target.value })} onChange={e => dispatch({ type: "usesChange", value: e.target.value })} value={state.uses.value} name="uses" id="product-uses" className="body-content tall-textarea form-control" type="text"></textarea>
          {state.uses.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.uses.message}</div>}
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

export default EditProduct
