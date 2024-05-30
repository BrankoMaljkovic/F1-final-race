import React from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY';

export default function SeasonYear() { // treba staviti map za izvlacenje godina
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const todayYear = new Date().getFullYear();

    return (
        <span>

            <Space direction="vertical">
                <DatePicker onChange={onChange} picker="year" 
                minDate={dayjs('2000', dateFormat)}
                maxDate={dayjs(`${todayYear}`, dateFormat)}/>
            </Space>

        </span>
    )
}