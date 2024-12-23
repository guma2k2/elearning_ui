import React, { useEffect, useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Popover, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import PopoverUserProfile from '../../components/popover-user-photo';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { match } from 'path-to-regexp';
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
    const { auth } = useAppSelector((state: RootState) => state.auth);
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
    const pathToKeyMap: Record<string, string> = {
        '/admin': '1',
        '/admin/users': '2',
        '/admin/categories': '3',
        '/admin/topics': '4',
        '/admin/courses': '5',
        '/admin/courses/edit/:id': '5',
        '/admin/courses/question/:id': '5',
        '/admin/coupons': '6',
        '/admin/orders': '7',
        '/admin/reviews': '8',
        '/admin/students': '9',
        '/admin/promotions': '10',
        '/admin/promotions/edit/:id': '10',
    };

    function getKeyForPath(path: string): string {
        for (const [route, key] of Object.entries(pathToKeyMap)) {
            const matcher = match(route, { decode: decodeURIComponent });
            if (matcher(path)) {
                return key;
            }
        }
        return '1'; // Default key if no match is found
    }

    useEffect(() => {
        const matchedKey = getKeyForPath(location.pathname);
        console.log(matchedKey);
        setSelectedKey(matchedKey);
    }, [location.pathname]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKey(e.key);
        console.log('Selected key:', e.key);
    };
    const items: MenuItem[] = [
        getItem('Thống kê', '1', <Link to={"/admin"}><PieChartOutlined /></Link>),
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý người dùng', '2', <Link to={"/admin/users"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý danh mục', '3', <Link to={"/admin/categories"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý chủ đề', '4', <Link to={"/admin/topics"}><DesktopOutlined /></Link>) : null,
        getItem('Quản lý khóa học', '5', <Link to={"/admin/courses"}><DesktopOutlined /></Link>),
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý mã giảm giá', '6', <Link to={"/admin/coupons"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý đơn hàng', '7', <Link to={"/admin/orders"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý đánh giá', '8', <Link to={"/admin/reviews"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý học sinh', '9', <Link to={"/admin/students"}><DesktopOutlined /></Link>) : null,
        auth?.user.role === "ROLE_ADMIN" ? getItem('Quản lý khuyến mãi', '10', <Link to={"/admin/promotions"}><DesktopOutlined /></Link>) : null,

    ];

    const getRole = (role: string | undefined) => {
        if (role == "ROLE_ADMIN") {
            return "Quản trị viên"
        } else if (role == "ROLE_INSTRUCTOR") {
            return "Giáo viên"
        }
        return "Khác"
    }
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
                    Quản trị
                </div>
                <Menu onClick={handleMenuClick} selectedKeys={[selectedKey]} theme="dark" mode="inline" items={items} />
            </Sider>
            <Layout >
                <Header style={{ padding: 0, marginBottom: "30px", background: colorBgContainer }}>
                    <div className="header-admin-info" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginRight: "20px", gap: "20px" }}>
                        <span>{getRole(auth?.user.role)}</span>
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