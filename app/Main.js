import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
Axios.defaults.baseURL = "https://localhost:44303/api"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
//My components
import LoadingDotsIcon from "./components/LoadingDotsIcon"
import Header from "./components/Header"
import Login from "./components/user/Login"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/user/Home"
import FlashMessages from "./components/FlashMessages"
import NotFound from "./components/NotFound"
import CreateProduct from "./components/admin/CreateProduct"
import EditProduct from "./components/admin/EditProduct"
import AdminLogin from "./components/admin/AdminLogin"
import AdminHome from "./components/admin/AdminHome"
import AdminHeader from "./components/admin/AdminHeader"
import Cart from "./components/user/Cart"
import PlaceOrder from "./components/user/PlaceOrder"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("ehealthcareappToken")),
    flashMessages: [],
    user: {
      accessToken: localStorage.getItem("ehealthcareappToken"),
      firstName: localStorage.getItem("ehealthcareappFirstName"),
      lastName: localStorage.getItem("ehealthcareappLastName"),
      isAdmin: localStorage.getItem("ehealthcareappisAdmin"),
      id: localStorage.getItem("ehealthcareappuserId")
    },
    // adminUser: {
    //   adminaccessToken: localStorage.getItem("ehealthcareappToken"),
    //   firstName: localStorage.getItem("ehealthcareappFirstName"),
    //   lastName: localStorage.getItem("ehealthcareappLastName"),
    //   isAdmin: localStorage.getItem("ehealthcareappisAdmin"),
    //   id: localStorage.getItem("ehealthcareappuserId")
    // },
    // isSearchOpen: false,
    // isChatOpen: false,
    cartCount: 0,
    adminLoggedIn: Boolean(localStorage.getItem("ehealthcareappToken")),
    isAdminPage: false
  }
  // function ourReducer(state, action) {
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        console.log("draft.loggedIn")
        return
      case "logout":
        draft.loggedIn = false
        // draft.adminLoggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "adminLogin":
        draft.loggedIn = true
        draft.adminLoggedIn = true
        draft.user = action.data
        console.log("draft.adminLoggedIn")
        return
      case "logout":
        draft.loggedIn = false
        draft.adminLoggedIn = false
        console.log("logout-adminloggedIn")
        return
      case "adminPage":
        draft.isAdminPage = true
        console.log(draft.isAdminPage)
        console.log("draft.isAdminPage")

        return
      case "incrementCartCount":
        draft.cartCount = action.data
        draft.cartCount++
        // draft.cartCount = draft.cartCount - 1
        // draft.cartCount++
        // console.log(draft.cartCount)
        return
      case "clearCartCount":
        draft.cartCount = 0
        // console.log(draft.cartCount)

        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  useEffect(() => {
    if (state.loggedIn) {
      // console.log(state.user.accessToken)
      localStorage.setItem("ehealthcareappToken", state.user.accessToken)
      localStorage.setItem("ehealthcareappFirstName", state.user.firstName)
      localStorage.setItem("ehealthcareappLastName", state.user.lastName)
      localStorage.setItem("ehealthcareappIsAdmin", state.user.isAdmin)
      localStorage.setItem("ehealthcareappuserId", state.user.id)
    } else {
      console.log("loggedIn-Remove")
      localStorage.removeItem("ehealthcareappToken")
      localStorage.removeItem("ehealthcareappFirstName")
      localStorage.removeItem("ehealthcareappLastName")
      localStorage.removeItem("ehealthcareappIsAdmin")
      localStorage.removeItem("ehealthcareappuserId")
    }
  }, [state.loggedIn])

  useEffect(() => {
    if (state.adminLoggedIn) {
      //console.log(state.user.accessToken)
      localStorage.setItem("ehealthcareappToken", state.user.accessToken)
      localStorage.setItem("ehealthcareappFirstName", state.user.firstName)
      localStorage.setItem("ehealthcareappLastName", state.user.lastName)
      localStorage.setItem("ehealthcareappIsAdmin", state.user.isAdmin)
      localStorage.setItem("ehealthcareappuserId", state.user.id)
    } else {
      console.log("adminloggedIn-Remove")

      localStorage.removeItem("ehealthcareappToken")
      localStorage.removeItem("ehealthcareappFirstName")
      localStorage.removeItem("ehealthcareappLastName")
      localStorage.removeItem("ehealthcareappIsAdmin")
      localStorage.removeItem("ehealthcareappuserId")
    }
  }, [state.adminLoggedIn])

  const [adminLoggedIn, setAdminLoggedIn] = useState(Boolean(localStorage.getItem("ehealthcareappToken")))
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("ehealthcareappToken")))
  const [flashMessages, setFlashMessages] = useState([])

  function addFlashMessage(msg) {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    // <ExampleContext.Provider value={{ addFlashMessage, setLoggedIn }}>
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          {/* <Header loggedIn={adminLoggedIn} setLoggedIn={setAdminLoggedIn} /> */}
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          {/* <Navbar /> */}
          {/* <Header loggedIn={loggedIn} /> */}
          {/* ({state.isAdminLogin} ? <AdminHeader /> : <Header />) */}
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              {/* <Route path="/profile/:firstname/*" element={<Profile />} /> */}
              {/* <Route path="/admin/*" element={state.loggedIn && state.isAdminLogin ? <AdminHome /> : <AdminLogin />} /> */}
              <Route path="/" element={state.loggedIn ? <Home /> : <Login />} />
              {/* <Route path="/" element={state.loggedIn ? <Home /> : <Login />} /> */}
              {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
              <Route path="/admin/home" element={state.loggedIn && state.adminLoggedIn ? <AdminHome /> : <AdminLogin />} />
              <Route path="/cart" element={<Cart />} />
              {/* <Route path="/" element={state.loggedIn ? <Home /> : <Login />} /> */}
              {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
              <Route path="/admin/create-product" element={<CreateProduct addFlashMessage={addFlashMessage} />} />
              <Route path="/admin/product/:id/edit" element={<EditProduct />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">{/* <Search /> */}</Suspense>
            </div>
          </CSSTransition>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
