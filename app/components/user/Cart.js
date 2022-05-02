import React, { useEffect, useContext } from "react"
import Page from "../Page"
import StateContext from "../../StateContext"
import { useImmer } from "use-immer"
import LoadingDotsIcon from "../LoadingDotsIcon"
import Axios from "axios"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import AddCart from "./AddCart"
import DispatchContext from "../../DispatchContext"
import { useNavigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"

function Cart() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  // const [id, setId] = useState()

  const [state, setState] = useImmer({
    isLoading: true,
    items: []
  })

  const initialState = {
    reload: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "reload":
        console.log(draft.reload)
        draft.reload++
        console.log(draft.reload)
        return
    }
  }
  const [dispatchState, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
        const response = await Axios.get(`/cart/GetByUserID/${appState.user.id}`, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } }, { cancelToken: ourRequest.token })
        console.log(response.data)
        // const cats = response.data.items.reduce((catsSoFar, { productID, cartID }) => {
        //   if (!catsSoFar[item.productID]) catsSoFar[productID] = []
        //   catsSoFar[productID].push(cartID)
        //   return catsSoFar
        // }, {})
        // console.log(cats)
        setState(draft => {
          draft.isLoading = false
          draft.items = response.data.items
          console.log(draft.items)
        })
      } catch (error) {
        console.log(error + "There was a problem.")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
        const response = await Axios.get(`/cart/GetByUserID/${appState.user.id}`, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } }, { cancelToken: ourRequest.token })
        console.log(response.data)
        // const cats = response.data.items.reduce((catsSoFar, { productID, cartID }) => {
        //   if (!catsSoFar[item.productID]) catsSoFar[productID] = []
        //   catsSoFar[productID].push(cartID)
        //   return catsSoFar
        // }, {})
        // console.log(cats)
        setState(draft => {
          draft.isLoading = false
          draft.items = response.data.items
          console.log(draft.items)
        })
      } catch (error) {
        console.log(error + "There was a problem.")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [dispatchState.reload])

  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  async function deleteHandler(id) {
    // const areYouSure = window.confirm("Do you really want to delete this product from cart?")
    // if (areYouSure) {
    try {
      const response = await Axios.delete(`/cart/Delete/${id}`, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } })

      if (response.status == 200) {
        //1, display a flash message
        appDispatch({ type: "flashMessage", value: "Product was successfully deleted from the cart." })
        dispatch({ type: "reload" })
      }
    } catch (error) {
      console.log(error)
    }
    // }
  }

  async function placeOrder() {
    //const areYouSure = window.confirm("Do you really want to delete this product from cart?")
    //if (areYouSure) {
    try {
      const response = await Axios.post(`/cart/PlaceOrder/${appState.user.id}`, {}, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } })

      if (response.status == 200) {
        //1, display a flash message
        appDispatch({ type: "flashMessage", value: "Order was successfully placed." })
        dispatch({ type: "clearCartCount" })
        navigate("/place-order")
      }
    } catch (error) {
      console.log(error)
    }
    //}
  }
  return (
    <Page title="Your medicines" wide={true}>
      <h2 className="text-left">
        Hello <strong>{appState.user.firstName} </strong>, your cart is here.
      </h2>
      <div className="container mt-5 p-3 rounded cart">
        <div className="row no-gutters">
          <div className="col-md-8">
            <div className="product-details mr-2">
              <div className="d-flex flex-row align-items-center">
                {/* <i className="fa fa-long-arrow-left"></i> */}
                <a href="/" className="ml-2">
                  Continue Shopping
                </a>
              </div>
              <hr />
              <h6 className="mb-0">Shopping cart</h6>
              <div className="d-flex justify-content-between">
                <span>You have {state.items.length} items in your cart</span>
                {/* <div className="d-flex flex-row align-items-center">
                  <span className="text-black-50">Sort by:</span>
                  <div className="price ml-2">
                    <span className="mr-1">price</span>
                    <i className="fa fa-angle-down"></i>
                  </div>
                </div> */}
              </div>
              {state.items.length > 0 &&
                state.items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
                    <div className="d-flex flex-row">
                      <img className="rounded" src={item.product.imageUrl} width="40" />
                      <div className="ml-2">
                        <span className="font-weight-bold d-block">{item.product.name}</span>
                        <span className="spec">{item.product.companyName}</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <span className="d-block">1</span>
                      <span className="d-block ml-5 font-weight-bold">&#x20B9;{item.product.price}</span>
                      {/* <i className="fa fa-trash-o ml-3 text-black-50"></i> */}
                      <a onClick={() => deleteHandler(item.id)} data-tip="Delete" data-for="delete" className="delete-post-button text-danger ml-3">
                        <i className="fas fa-trash"></i>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="payment-info">
              <div className="d-flex justify-content-between align-items-center">
                <button onClick={placeOrder} className="btn btn-primary btn-block d-flex justify-content-between mt-3 py-3" type="button" disabled={state.items.length == 0 ? "disabled" : ""}>
                  {/* <span>$3020.00</span> */}
                  <h5>
                    Place Order
                    {/* <i className="fa fa-long-arrow-right ml-1"></i> */}
                  </h5>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {state.items.length === 0 && (
        <>
          {" "}
          <h2 className="text-center">
            Hello <strong>{appState.user.firstName}</strong>, your cart is empty.
          </h2>
          <p className="lead text-muted text-center">Your medicines displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )} */}
    </Page>
  )
}

export default Cart
