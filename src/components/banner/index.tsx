import BannerImage from "../../assets/banner-udemy.jpg"
import './Banner.style.scss'
function Banner() {
    return (
        <div className="banner-container">
            <img src={BannerImage} alt="udemy-banner" />
            <div className="banner-item">
                <h1>Learning that gets you</h1>
                <p>Skills for your present (and your future). Get started with us.</p>
            </div>
        </div>
    )
}

export default Banner