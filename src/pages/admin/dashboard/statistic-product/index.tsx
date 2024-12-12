import { Button, DatePicker, DatePickerProps, Flex, GetProps, Table, TableColumnsType, TimePicker } from 'antd';
import { useState } from 'react'
import './StatisticProduct.style.scss'
import dayjs, { Dayjs } from 'dayjs';
import { StatisticProductType } from '../../../../types/StatisticType';
import { getStatisticCourseByTime } from '../../../../services/StatisticService';
import { formatCurrency } from '../../../../utils/Format';
import { FaFileExcel } from 'react-icons/fa6';
function StatisticProduct() {
    const { RangePicker } = DatePicker;
    const [statisticProducts, setStatisticProducts] = useState<StatisticProductType[]>();
    const columns: TableColumnsType<StatisticProductType> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 50
        },
        {
            title: 'Khóa học',
            dataIndex: 'course',
            width: 300,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 100,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'price',
            width: 200,
        }
    ];
    const handleChange = async (
        _dates: [Dayjs | null, Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        console.log(dateStrings);
        const from = dateStrings[0];
        const to = dateStrings[1];
        console.log(from);
        console.log(to);

        let params: string = ""
        if (from && to) {
            params += `?from=${from}&to=${to}`
        }
        const res = await getStatisticCourseByTime(params);
        console.log(res);

        if (res.status == 200) {
            const data = res.data as StatisticProductType[];
            const content = data.map((statistic: StatisticProductType, index) => (
                {
                    ...statistic, key: statistic.course, stt: index + 1
                }
            ))

            setStatisticProducts(content);
        }
    };

    const getTotalPrice = (): number => {
        if (statisticProducts) {
            let total: number = 0;
            statisticProducts.forEach((sta) => {
                total += sta.price;
            })

            console.log(total);
            return total;
        }
        return 0;
    }

    return <div className="statistic-product-container">
        <div className="statistic-container">
            <div className='statistic-header' >
                <h3>Bảng thống kê doanh thu theo khóa học theo thời gian</h3>
                <div className="statistic-header-action">
                    <RangePicker
                        className='statistic-product-input'
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={handleChange}
                    />
                    <div className="statistic-product-input-right">
                        <Button className="statistic-product-input-btn-export" icon={<FaFileExcel />}>Xuất file</Button>
                    </div>
                </div>
            </div>
            <Table columns={columns} dataSource={statisticProducts} scroll={{ x: 1000 }}
                footer={() => <div className="statistic-footer">
                    <span>Tổng doanh thu: {formatCurrency(getTotalPrice())}</span>
                </div>}
            />

        </div>
    </div>
}

export default StatisticProduct;