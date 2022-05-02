import React, { useEffect } from "react"
import Page from "../Page"
import { Link } from "react-router-dom"

function PlaceOrder() {
  return (
    <Page title="Order">
      <div className="text-center">
        <h2>Your order is completed successfully.</h2>
        <p className="lead text-muted">
          You can always visit the <Link to="/"> home page</Link> to Continue shopping.
        </p>
      </div>
    </Page>
  )
}

export default PlaceOrder
