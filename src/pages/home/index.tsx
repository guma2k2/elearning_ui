import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import './index.style.scss'
import { useEffect } from "react"
import { useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"
function Home() {
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth) {
            if (auth.user.role === "ROLE_ADMIN") {
                // const url = window.location.pathname;
                navigate("/admin")
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