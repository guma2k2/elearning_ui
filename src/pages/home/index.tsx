import { Outlet } from "react-router-dom"
import Footer from "../../components/footer"
import Navbar from "../../components/navbar"
import Banner from "../../components/banner"

function Home() {
    return (
        <>
            <Navbar />
            <Banner />
            <Outlet />
            <Footer />
        </>
    )
}

export default Home