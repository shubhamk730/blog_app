import { Link } from "react-router-dom"

const Error = () => {
  return (
    <div className='text-center pt-3'>
        <h1 className="font-extrabold">
            OOPS! Something went wrong. Please click <Link to="/" className="underline text-blue-500 hober:text-blue-700">here</Link> to return back to home page.
        </h1>
    </div>
  )
}

export default Error