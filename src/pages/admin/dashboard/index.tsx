import { Card, DatePickerProps, Tabs, TabsProps } from "antd"
import { useEffect, useState } from "react"
import './Dashboard.style.scss'
import StatisticYear from "./statistic-year";
import StatisticMonth from "./statistic-month";
import { getDashboard } from "../../../services/StatisticService";
import { DashboardType } from "../../../types/StatisticType";
import StatisticProduct from "./statistic-product";

function Dashboard() {
    const [dashboard, setDashboard] = useState<DashboardType>();
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Theo năm',
            children: <StatisticYear />,
        },
        {
            key: '2',
            label: 'Theo tháng',
            children: <StatisticMonth />,
        },
        {
            key: '3',
            label: 'Theo khóa học',
            children: <StatisticProduct />,
        }
    ];

    const fetchDashboard = async () => {
        const res = await getDashboard();
        if (res.status == 200) {
            const data = res.data as DashboardType
            setDashboard(data);
        }
    }
    useEffect(() => {
        fetchDashboard();
    }, [])
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">THỐNG KÊ</h1>
            <div className="dashboard-card-container">
                <Card title="Đơn hàng" bordered={false} style={{ width: 300 }}>
                    <p>{dashboard?.totalOrders}</p>
                </Card>
                <Card title="Đánh giá" bordered={false} style={{ width: 300 }}>
                    <p>{dashboard?.totalReviews}</p>
                </Card>
                <Card title="Khóa học" bordered={false} style={{ width: 300 }}>
                    <p>{dashboard?.totalReviews}</p>
                </Card>
                <Card title="Học sinh" bordered={false} style={{ width: 300 }}>
                    <p>{dashboard?.totalStudents}</p>
                </Card>
            </div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default Dashboard