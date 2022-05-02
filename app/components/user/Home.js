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

function Home() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()
  // const [id, setId] = useState()

  const [state, setState] = useImmer({
    isLoading: true,
    products: []
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
        const response = await Axios.get("/getallmedicine", { token: appState.user.accessToken }, { cancelToken: ourRequest.token })
        setState(draft => {
          draft.isLoading = false
          draft.products = response.data
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

  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <Page title="Your medicines" wide={true}>
      <h2 className="text-left">
        Hello{" "}
        <strong>
          {appState.user.firstName} {appState.user.lastName}
        </strong>
        , your medicines are here.
        {/* Hello <strong>{appState.user.username}</strong>, your medicines are here. */}
      </h2>

      <div className="container d-flex justify-content-center mt-50 mb-50">
        <div className="row">
          {state.products.length > 0 &&
            state.products.map(product => (
              <div className="col-md-4 mt-2" key={product.id}>
                <div className="card">
                  <div className="card-body">
                    <div className="card-img-actions">
                      {" "}
                      <img src={product.imageUrl} className="card-img" width="96" height="150" alt="" />{" "}
                    </div>
                  </div>
                  <div className="card-body bg-light text-center">
                    <div className="mb-2">
                      <h6 className="font-weight-semibold mb-2">
                        {" "}
                        <a href="#" className="text-default mb-2" data-abc="true">
                          {product.name}
                        </a>{" "}
                      </h6>{" "}
                      <a href="#" className="text-muted" data-abc="true">
                        {product.companyName}
                      </a>
                    </div>
                    <h3 className="mb-0 font-weight-semibold">&#x20B9;{product.price}</h3>
                    {/* <div>
                      {" "}
                      <i className="fa fa-star star"></i> <i className="fa fa-star star"></i> <i className="fa fa-star star"></i> <i className="fa fa-star star"></i>{" "}
                    </div>
                    <div className="text-muted mb-3">34 reviews</div>{" "} */}
                    {/* <button type="button" className="btn bg-cart">
                      <i className="fa fa-cart-plus mr-2"></i> Add to cart
                    </button> */}
                    <AddCart productId={product.id} userId={appState.user.id} token={appState.user.accessToken} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {state.products.length === 0 && (
        <>
          {" "}
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your medicines are empty.
          </h2>
          <p className="lead text-muted text-center">Your medicines displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </Page>
  )
}

export default Home
