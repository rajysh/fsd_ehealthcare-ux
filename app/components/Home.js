import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Axios from "axios"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import Post from "./Post"
import DispatchContext from "../DispatchContext"
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
        const response = await Axios.get("/getallmedicine", { token: appState.user.token }, { cancelToken: ourRequest.token })
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

  useEffect(() => {
    if (dispatchState.reload) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchData() {
        try {
          //console.log(`/profile/${username}, { token: ${appState.user.token} }`)
          const response = await Axios.get("/getallmedicine", { token: appState.user.token }, { cancelToken: ourRequest.token })
          setState(draft => {
            draft.isLoading = false
            draft.products = response.data
          })
          console.log("reload")
        } catch (error) {
          console.log(error + "There was a problem.")
        }
      }
      fetchData()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [dispatchState.reload])

  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  async function deleteHandler(id) {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/admin/deleteMedicineById/${id}`, { data: { token: appState.user.token } })

        if (response.status == 200) {
          //1, display a flash message
          appDispatch({ type: "flashMessage", value: "Product was successfully deleted." })
          dispatch({ type: "reload" })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <Page title="Your medicines" wide={true}>
      {state.products.length > 0 && (
        <>
          <h2 className="text-center-mb-4">The Latest From Those You Follow</h2>
          {/* <div className="list-group">
            {state.medicines.map(post => {
              return <Post post={post} key={post._id} />
            })}
          </div> */}
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
                    {/* <button className="btn btn-primary" type="button">
                      Edit
                    </button>
                    <button className="btn btn-danger" type="button">
                      Delete
                    </button> */}
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
      )}
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
