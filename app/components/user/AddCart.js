import React, { useState, useEffect, useContext, useRef } from "react"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link } from "react-router-dom"

function AddCart(props) {
  const [token, setToken] = useState()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    cartItems: 0
  })

  useEffect(() => {
    const token = localStorage.getItem("ehealthcareappToken")
    console.log(token)
    if (token) {
      setToken(token)
    }
  }, [])

  // // function handleFieldChange(e) {
  // //   const value = e.target.value
  // //   setState(draft => {
  // //     draft.fieldValue = value
  // //   })
  // // }

  // useEffect(() => {
  //   console.log("CArt item useffect")
  //   const ourRequest = Axios.CancelToken.source()
  //   async function fetchData() {
  //     try {
  //       //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
  //       // console.log(`${props.productId} + "-" + ${appState.user.id}`)
  //       // console.log(`${props.userId} + "-" + ${props.userId}`)

  //       const response = await Axios.post(`/cart/add/${props.productId}/${props.userId}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
  //       setState(draft => {
  //         draft.isLoading = false
  //         draft.products = response.data
  //       })
  //       appDispatch({ type: "incrementCartCount" })
  //     } catch (error) {
  //       console.log(error + "There was a problem.")
  //     }
  //   }
  //   fetchData()
  //   return () => {
  //     ourRequest.cancel()
  //   }
  // }, [state.cartItems])

  // function handleSubmit(e) {
  //   e.preventDefault()
  //   //Send message to chat server
  //   // socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

  //   setState(draft => {
  //     //Add the message to state collection of messages
  //     draft.cartItems++
  //   })
  // }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post(`/cart/add/${props.productId}/${props.userId}`, {}, { headers: { Authorization: `Bearer ${appState.user.accessToken}`, "content-type": "application/json" } })

      if (response.status == 200) {
        // console.log(appState.cartCount)
        const count = appState.cartCount
        appDispatch({ type: "incrementCartCount", data: count })
        appDispatch({ type: "flashMessage", value: "Added to cart successfully." })
        // console.log("Cart" + count)
        // console.log("New product was created.")
      }
    } catch (error) {
      console.log("There was a problem updating the product.")
    }
  }
  return (
    <button onClick={handleSubmit} type="button" className="btn bg-cart">
      <i className="fa fa-cart-plus mr-2"></i> Add to cart
    </button>
  )
}

export default AddCart
