import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa6'
import './Footer.style.scss'
function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-info">
                <div className="address">
                    <ul>
                        <li>Học Lập Trình Để Đi Làm</li>
                        <li>Điện thoại: 0246.329.1102</li>
                        <li>Email: contact@fullstack.edu.vn</li>
                        <li>Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>VỀ F8</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>SẢN PHẨM</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>CÔNG CỤ</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Điều khoản</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
            </div>
            <div className="footer-contact">
                <span>© 2018 - 2024 F8. Nền tảng học lập trình hàng đầu Việt Nam</span>
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