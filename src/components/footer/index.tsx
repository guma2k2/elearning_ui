import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa6'
import './Footer.style.scss'
function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-info">
                <div className="address">
                    <ul>
                        <li>Học Lập Trình Để Đi Làm</li>
                        <li>Điện thoại: 0352304114</li>
                        <li>Email: thuanngo3072002@gmail.com</li>
                        <li>Địa chỉ: Thủ Đức, Tp Hồ Chí Minh</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>Về website</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>Sản phẩm</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>Công cụ</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
            </div>
            <div className="footer-contact">
                <span>© 2023 - 2025 . Nền tảng học lập trình hàng đầu Việt Nam</span>
                <div className="footer-icon">
                    <FaYoutube />
                    <FaFacebook />
                    <FaTiktok />
                </div>
            </div>
        </div>
    )
}

export default Footer