import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
// import ExampleContext from "../ExampleContext"

function AdminHeaderLoggedIn(props) {
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

  function handleSearchIcon(e) {
    e.preventDefault()

    appDispatch({ type: "openSearch" })
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a data-for="search" data-tip="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" class="custom-tooltip" /> {"         "}
      <span onClick={() => appDispatch({ type: "toggleChat" })} data-for="chat" data-tip="Chat" className={"mr-2 ml-1 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"} </span> : ""}
      </span>
      <ReactTooltip place="bottom" id="chat" class="custom-tooltip" />
      {"  "}
      <Link data-for="profile" data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-2">
        {/* <img className="small-header-avatar" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> */}
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" class="custom-tooltip" />
      <Link className="btn btn-sm btn-success mr-2 ml-1" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="ml-1 btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default AdminHeaderLoggedIn
