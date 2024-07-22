import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
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

const items: MenuItem[] = [
    getItem('Dashboard', '1', <Link to={"/admin"}><PieChartOutlined /></Link>),
    getItem('User', '2', <Link to={"/admin/users"}><DesktopOutlined /></Link>),
    getItem('Category', '3', <Link to={"/admin/categories"}><DesktopOutlined /></Link>),
    getItem('Topic', '4', <Link to={"/admin/topics"}><DesktopOutlined /></Link>),
    getItem('Course', '5', <Link to={"/admin/courses"}><DesktopOutlined /></Link>),
    getItem('Coupon', '6', <Link to={"/admin/coupons"}><DesktopOutlined /></Link>),
    getItem('Order', '7', <Link to={"/admin/orders"}><DesktopOutlined /></Link>),
    getItem('Review', '8', <Link to={"/admin/reviews"}><DesktopOutlined /></Link>),
    getItem('Student', '9', <Link to={"/admin/students"}><DesktopOutlined /></Link>),

];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { auth, isLoggin } = useAppSelector((state: RootState) => state.auth);

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
                    <Popover
                        content={PopoverUserProfile}
                        rootClassName="popover-profiles"
                        trigger="click"
                        open={openProfile}
                        placement="bottomLeft"
                        onOpenChange={handleOpenProfileChange}
                    >
                        <img src={auth?.user.photoURL} alt="Photo" className="profile" />
                    </Popover>
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