import React, { useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Popover, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import PopoverUserProfile from '../../components/popover-user-photo';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}



const App: React.FC = () => {
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);
    const items: MenuItem[] = [
        getItem('Thống kê', '1', <Link to={"/admin"}><PieChartOutlined /></Link>),
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý người dùng', '2', <Link to={"/admin/users"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý danh mục', '3', <Link to={"/admin/categories"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý chủ đề', '4', <Link to={"/admin/topics"}><DesktopOutlined /></Link>) : null,
        getItem('Quản lý khóa học', '5', <Link to={"/admin/courses"}><DesktopOutlined /></Link>),
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý khuyến mãi', '6', <Link to={"/admin/coupons"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý đơn hàng', '7', <Link to={"/admin/orders"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý đánh giá', '8', <Link to={"/admin/reviews"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý học sinh', '9', <Link to={"/admin/students"}><DesktopOutlined /></Link>) : null,

    ];
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const handleOpenProfileChange = (newOpen: boolean) => {
        setOpenProfile(newOpen);
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" style={{ height: "80px", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    F8 ADMIN
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout >
                <Header style={{ padding: 0, marginBottom: "30px", background: colorBgContainer }}>
                    <div className="header-admin-info" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginRight: "20px", gap: "20px" }}>
                        <span>{auth?.user.role}</span>
                        <Popover
                            content={PopoverUserProfile}
                            rootClassName="popover-profiles"
                            trigger="click"
                            open={openProfile}
                            placement="bottomLeft"
                            onOpenChange={handleOpenProfileChange}
                        >
                            <img src={auth?.user.photoURL} alt="Photo" className="profile" style={{
                                width: "30px",
                                height: "30px", objectFit: "cover", borderRadius: "50%"
                            }} />
                        </Popover>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 500,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;