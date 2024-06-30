import { Outlet } from "react-router-dom"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"

function Home() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Home