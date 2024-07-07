import { Outlet } from "react-router-dom"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import './index.style.scss'
function Home() {
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