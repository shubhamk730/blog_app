import { isUserLoggedIn } from "../hooks"
import { Avatar } from "./BlogCard"
import { Link, useNavigate } from "react-router-dom"

export const Appbar = () => {
    const isLoggedIn = isUserLoggedIn();
    const navigate = useNavigate();

    const signoutHandler = () => {
        try {
            const token = localStorage.getItem("token");
            if(token?.length) {
                localStorage.removeItem("token");
                navigate("/signin");
            }
        } catch(ex) {
            navigate("/");
        }
    }

    return <div className="border-b flex justify-between px-10 py-4">
        <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
                Medium
        </Link>
        <div>
            <Link to={`/publish`}>
                <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>

            {isLoggedIn && <span>
                <button type="button" className="mr-4 text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={signoutHandler}>Signout</button>
            </span>}

            <Avatar size={"big"} name="User" />
        </div>
    </div>
}