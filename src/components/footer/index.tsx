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
                        <li>Địa chỉ: Tổ 9, khu phố 4, phường Trảng Dài, Biên Hòa, Đồng Nai</li>
                    </ul>
                </div>
                <div className="address">
                    <ul>
                        <li>VỀ website</li>
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
                <span>© 2018 - 2024 . Nền tảng học lập trình hàng đầu Việt Nam</span>
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