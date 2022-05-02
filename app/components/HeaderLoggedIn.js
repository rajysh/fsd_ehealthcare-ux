import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Badge from "@material-ui/core/Badge"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
// import ExampleContext from "../ExampleContext"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  // const { setLoggedIn } = useContext(ExampleContext)
  function handleLogout() {
    // setLoggedIn(false)
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "You have successfully logged out." })

    // localStorage.removeItem("complexappToken")
    // localStorage.removeItem("complexappUsername")
    // localStorage.removeItem("complexappAvatar")
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        console.log(`/cart/GetByUserID/${appState.user.id}`)
        const response = await Axios.get(`/cart/GetByUserID/${appState.user.id}`, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } }, { cancelToken: ourRequest.token })
        console.log(response.data.items.length)
        // setState(draft => {
        //   draft.isLoading = false
        //   //draft.products = response.data
        // })
        appDispatch({ type: "incrementCartCount", data: response.data.items.length })
      } catch (error) {
        console.log(error + "There was a problem.")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  return (
    <div className="flex-row my-3 my-md-0">
      {/* <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a> */}
      {/* <ReactTooltip place="bottom" id="search" class="custom-tooltip" /> {"         "} */}
      {/* <span onClick={() => appDispatch({ type: "toggleChat" })} data-for="chat" data-tip="Chat" className={"mr-2 ml-1 header-chat-icon " + (appState.cartCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {appState.cartCount ? <span className="chat-count-badge text-white">{appState.cartCount < 10 ? appState.cartCount : "9+"} </span> : ""}
      </span> */}
      <Badge className="mr-4" color="secondary" badgeContent={appState.cartCount} data-for="cart" data-tip="Cart">
        <ShoppingCartIcon />
        {"  "}
      </Badge>
      <ReactTooltip place="bottom" id="cart" class="custom-tooltip" />
      {"  "}
      {/* <Link data-for="profile" data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link> */}
      <ReactTooltip place="bottom" id="profile" class="custom-tooltip" />
      <Link className="btn btn-sm btn-success mr-2 ml-1" to="/cart">
        Go to Cart
      </Link>
      <button onClick={handleLogout} className="ml-1 btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
