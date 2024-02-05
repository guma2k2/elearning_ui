import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

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
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('User', '2', <Link to={"/admin/users"}><DesktopOutlined /></Link>),
    getItem('Category', '3', <Link to={"/admin/categories"}><DesktopOutlined /></Link>),
    getItem('Topic', '4', <Link to={"/admin/topics"}><DesktopOutlined /></Link>),
    getItem('Course', 'sub1', <UserOutlined />, [
        getItem('Tom', '5'),
        getItem('Bill', '6'),
        getItem('Alex', '7'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '8'), getItem('Team 2', '9')]),
    getItem('Files', '10', <FileOutlined />),
];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>

                <div className="demo-logo-vertical" style={{ height: "80px", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    F8 ADMIN
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout >
                <Header style={{ padding: 0, marginBottom: "30px", background: colorBgContainer }} />
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