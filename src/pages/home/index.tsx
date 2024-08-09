import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import './index.style.scss'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"
import { getCartsByUser } from "../../redux/slices/CartSlice"
import { getLearningCourse } from "../../redux/slices/LearningCourseSlice"
function Home() {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth) {
            if (auth.user.role === "ROLE_ADMIN" || auth.user.role === "ROLE_INSTRUCTOR") {
                // const url = window.location.pathname;
                navigate("/admin")
            } else {
                dispatch(getCartsByUser());
                dispatch(getLearningCourse());
            }
        }
    }, [])
    return (
        <div className="home-container">
            <Navbar />
            <div className="outlet-container">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Home