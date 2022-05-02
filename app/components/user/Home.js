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

  // const initialState = {
  //   reload: 0
  // }

  // function ourReducer(draft, action) {
  //   switch (action.type) {
  //     case "reload":
  //       console.log(draft.reload)
  //       draft.reload++
  //       console.log(draft.reload)
  //       return
  //   }
  // }

  // const [dispatchState, dispatch] = useImmerReducer(ourReducer, initialState)

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

  // useEffect(() => {
  //   if (dispatchState.reload) {
  //     const ourRequest = Axios.CancelToken.source()
  //     async function fetchData() {
  //       try {
  //         //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
  //         const response = await Axios.get("/getallmedicine", { token: appState.user.token }, { cancelToken: ourRequest.token })
  //         setState(draft => {
  //           draft.isLoading = false
  //           draft.products = response.data
  //         })
  //         console.log("reload")
  //       } catch (error) {
  //         console.log(error + "There was a problem.")
  //       }
  //     }
  //     fetchData()
  //     return () => {
  //       ourRequest.cancel()
  //     }
  //   }
  // }, [dispatchState.reload])

  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  // async function deleteHandler(id) {
  //   const areYouSure = window.confirm("Do you really want to delete this post?")
  //   if (areYouSure) {
  //     try {
  //       const response = await Axios.delete(`/admin/deleteMedicineById/${id}`, { data: { token: appState.user.token } })

  //       if (response.status == 200) {
  //         //1, display a flash message
  //         appDispatch({ type: "flashMessage", value: "Product was successfully deleted." })
  //         dispatch({ type: "reload" })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }
  return (
    <Page title="Your medicines" wide={true}>
      <h2 className="text-left">
        Hello, your medicines are here.
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
                      {/* <img src={product.imageUrl} className="card-img" width="96" height="350" alt="" />{" "} */}
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
      {/* <div className="col-xs-12 col-md-6">
        {state.products.length > 0 &&
          state.products.map(product => (
            <div className="prod-info-main prod-wrap clearfix">
              <div className="row">
                <div className="col-md-5 col-sm-12 col-xs-12">
                  <div className="product-image">
                    <img src={product.imageUrl} className="img-responsive" width="150" height="140" />
                    
                  </div>
                </div>
                <div className="col-md-7 col-sm-12 col-xs-12">
                  <div className="product-deatil">
                    <h5 className="name">
                      <a href="#">{product.name}</a>
                      <a>
                        <span className="">{product.companyName}</span>
                      </a>
                    </h5>
                   
                    <p className="price-container pt-2">
                      <span> &#x20B9;{product.price}</span>
                    </p>
                    <span className="tag1"></span>
                  </div>
                  <div className="description">
                    <p>{product.uses}</p>
                  </div>
                  <div className="product-info smart-form">
                    <div className="row">
                      <div className="col-md-12">
                        <AddCart />
                        <a href="javascript:void(0);" className="btn btn-info">
                          More info
                        </a>
                      </div>
                      .{" "}
                      <div className="col-md-12">
                    
                    <div className="rating">
                          Rating:
                          <label for="stars-rating-5">
                            <i className="fa fa-star text-danger"></i>
                          </label>
                          <label for="stars-rating-4">
                            <i className="fa fa-star text-danger"></i>
                          </label>
                          <label for="stars-rating-3">
                            <i className="fa fa-star text-danger"></i>
                          </label>
                          <label for="stars-rating-2">
                            <i className="fa fa-star text-warning"></i>
                          </label>
                          <label for="stars-rating-1">
                            <i className="fa fa-star text-warning"></i>
                          </label>
                        </div>
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div> */}
      {/* {state.products.length > 0 && (
        <>
          <h2 className="text-center-mb-4">The Latest From Those You Follow</h2>
           <div className="list-group">
            {state.medicines.map(post => {
              return <Post post={post} key={post._id} />
            })
          </div> }
          <Link className="btn btn-sm btn-success mr-2 ml-1" to="/create-product">
            Create Product
          </Link>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Company Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Uses</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img src={product.imageUrl} alt="Image" width="150" height="140" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.companyName}</td>

                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.uses}</td>
                  <td>{product.expireDate}</td>
                  <td>
                     <button className="btn btn-primary" type="button">
                      Edit
                    </button>
                    <button className="btn btn-danger" type="button">
                      Delete
                    </button> 
                    <span className="pt-2">
                      <Link to={`/product/${product.id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <ReactTooltip id="edit" className="custom-tooltip" />{" "}
                      <a onClick={() => deleteHandler(product.id)} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                        <i className="fas fa-trash"></i>
                      </a>
                      <ReactTooltip id="delete" className="custom-tooltip" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}
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
