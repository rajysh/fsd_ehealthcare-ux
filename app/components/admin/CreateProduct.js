import Axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Page from "../Page"
// import ExampleContext from "../ExampleContext"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function CreateProduct(props) {
  const [name, setName] = useState()
  const [companyname, setCompanyName] = useState()
  const [imageurl, setImageUrl] = useState()
  const [quantity, setQuantity] = useState()
  const [price, setPrice] = useState()
  const [uses, setUses] = useState()
  const [expireDate, setExpireDate] = useState()

  const navigate = useNavigate()
  // const { addFlashMessage } = useContext(ExampleContext)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/admin/addMedicine", { name, companyname, imageurl, quantity, price, uses, expireDate, token: appState.user.accessToken })
      console.log("New product was created.")
      //Redirect to new product URL
      // addFlashMessage("Congratulations, you have successfully created a product!!")
      appDispatch({ type: "flashMessage", value: "Congrats, you created a new product!!" })
      navigate(`/`)
    } catch (error) {
      console.log("There was a problem updating the product.")
    }
  }
  return (
    <Page title="Create product">
      <h2 className="text-center-mb-4">Add new Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-name" className="text-muted mb-1">
            <small>Name</small>
          </label>
          <input onChange={e => setName(e.target.value)} autoFocus name="name" id="product-name" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-companyname" className="text-muted mb-1">
            <small>Companyname</small>
          </label>
          <input onChange={e => setCompanyName(e.target.value)} autoFocus name="companyname" id="product-companyname" className="form-control form-control-lg form-control-companyname" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-imageurl" className="text-muted mb-1">
            <small>Image URL</small>
          </label>
          <input onChange={e => setImageUrl(e.target.value)} autoFocus name="imageurl" id="product-imageurl" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-quantity" className="text-muted mb-1">
            <small>Quantity</small>
          </label>
          <input onChange={e => setQuantity(e.target.value)} autoFocus name="quantity" id="product-quantity" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-price" className="text-muted mb-1">
            <small>Price</small>
          </label>
          <input onChange={e => setPrice(e.target.value)} autoFocus name="price" id="product-price" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-expiredate" className="text-muted mb-1">
            <small>Expiry Date</small>
          </label>
          <input onChange={e => setExpireDate(e.target.value)} autoFocus name="expiredate" id="product-expiredate" className="form-control form-control-lg form-control" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="product-uses" className="text-muted mb-1 d-block">
            <small>Uses</small>
          </label>
          <textarea onChange={e => setUses(e.target.value)} name="uses" id="product-uses" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New product</button>
      </form>
    </Page>
  )
}

export default CreateProduct
