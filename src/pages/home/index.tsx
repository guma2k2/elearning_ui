import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../../components/footer"
import './index.style.scss'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"
import { getCartsByUser } from "../../redux/slices/CartSlice"
import { getLearningCourse } from "../../redux/slices/LearningCourseSlice"
import Header from "../../components/header"
function Home() {
    const dispatch = useAppDispatch();
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth && isLoggin == true) {
            if (auth.user.role === "ROLE_ADMIN" || auth.user.role === "ROLE_INSTRUCTOR") {
                navigate("/admin")
            } else {
                const getDataOfUser = async () => {
                    dispatch(getCartsByUser());
                    dispatch(getLearningCourse());
                }
                getDataOfUser();
            }
        }
    }, [isLoggin])
    return (
        <div className="home-container">
            <Header />
            <div className="outlet-container">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Home