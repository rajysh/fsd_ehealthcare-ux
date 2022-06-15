import Axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "../Page"
// import ExampleContext from "../ExampleContext"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function CreateUser(props) {
  const [firstname, setFirstName] = useState()
  const [lastname, setLastName] = useState()
  const [email, setEmail] = useState()
  const [password, setPasssword] = useState()
  const [isadmin, setIsAdmin] = useState()
  const [dateofbirth, setDateofBirth] = useState()
  const [phone, setPhone] = useState()
  const [address, setAddress] = useState()

  const navigate = useNavigate()
  // const { addFlashMessage } = useContext(ExampleContext)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // if (isadmin) setIsAdmin(true)
      // else setIsAdmin(false)
      console.log(`/user/signup, ${firstname} ${lastname} ${email} ${password} ${isadmin} ${dateofbirth} ${phone} ${address}`)
      const response = await Axios.post("/user/signup", { firstname, lastname, email, password, isadmin, dateofbirth, phone, address })
      // const response = await Axios.post("/user/signup", { firstname, lastname, email, password, isadmin, dateofbirth, phone, address, token: appState.user.accessToken })
      console.log("New user was created.")
      //Redirect to new product URL
      // addFlashMessage("Congratulations, you have successfully created a product!!")
      appDispatch({ type: "flashMessage", value: "Congrats, user has beem created!!" })
      navigate(`/admin/users`)
    } catch (error) {
      console.log(error)
      console.log("There was a problem updating the user.")
    }
  }
  return (
    <Page title="Create user">
      <h2 className="text-center-mb-4">Add new Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user-firstname" className="text-muted mb-1">
            <small>First Name</small>
          </label>
          <input onChange={e => setFirstName(e.target.value)} autoFocus name="firstname" id="user-firstname" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="user-lastname" className="text-muted mb-1">
            <small>Last Name</small>
          </label>
          <input onChange={e => setLastName(e.target.value)} autoFocus name="lastname" id="user-lastname" className="form-control form-control-lg form-control-companyname" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="user-email" className="text-muted mb-1">
            <small>Email</small>
          </label>
          <input onChange={e => setEmail(e.target.value)} autoFocus name="email" id="user-email" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="user-password" className="text-muted mb-1">
            <small>Password</small>
          </label>
          <input onChange={e => setPasssword(e.target.value)} autoFocus name="password" id="user-password" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" name="isadmin" onChange={e => setIsAdmin(e.target.checked)} />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Is Admin?
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="user-dateofbirth" className="text-muted mb-1">
            <small>Date of Birth</small>
          </label>
          <input onChange={e => setDateofBirth(e.target.value)} autoFocus name="dateofbirth" id="user-dateofbirth" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="user-dateofbirth" className="text-muted mb-1">
            <small>Phone</small>
          </label>
          <input onChange={e => setPhone(e.target.value)} autoFocus name="phone" id="user-phone" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="user-uses" className="text-muted mb-1 d-block">
            <small>Address</small>
          </label>
          <textarea onChange={e => setAddress(e.target.value)} name="address" id="user-address" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New product</button>
      </form>
    </Page>
  )
}

export default CreateUser
