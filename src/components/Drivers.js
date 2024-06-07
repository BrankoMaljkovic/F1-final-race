import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";
import { Table } from 'antd';
import Breadcrumbs from './Breadcrumb';
import F1Loader from './F1Loader';


export default function Drivers(props) {
    console.log('drivers', props.flags);


    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        getDrivers();
    }, []);


    const getDrivers = async () => {
        const url = "http://ergast.com/api/f1/2013/driverStandings.json";
        const response = await axios.get(url);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    }

    const handleDriverId = (id) => { // TODO dodati u tabelu ofu funkciju
        console.log(`Constructor clicked: ${id}`);
        navigate(`/driverDetails/${id}`);
    };

    console.log(`table`, drivers);
    
    if (loading) {
        return < F1Loader />;
    }

    // Breadcrumb - promenjiva sa detaljima
    const breadcrumbs = [
        {label: 'Home'},
        { label: 'Drivers' },
        ];

    /* Tabela code ispod  */
    
    const uniqueTeams = [...new Set(drivers.map(item => item.Constructors[0].name))];
                console.log(`unique`,uniqueTeams);
    
    const columns = [
        { title: '', dataIndex: 'Number', },
        {
            title: 'Driver', dataIndex: 'Driver', filters: [
                ...drivers.map((driver, i) => { // Spread Operator - za prikaz elemenata objekta (u suprotnom se prikazuje ceo objekat)
                    return (
                        {
                            text: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
                            value: `${driver.Driver.givenName} ${driver.Driver.familyName}`
                        })
                    })
                ],
                filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value), // setujemo record.name
            width: '30%',
        },
        {
            title: 'Team', dataIndex: 'Team', align: 'center',
            filters: [
                ...uniqueTeams.map((teamName) => { // Spread Operator - za prikaz elemenata objekta (u suprotnom se prikazuje ceo objekat)
                    return (
                        {
                            text: `${teamName}`,
                            value: `${teamName}`
                        })
                    })
                ],
                onFilter: (value, record) => record.Team.startsWith(value),
                filterSearch: true,
                width: '40%',
            },
            {
                title: 'Points', dataIndex: 'Points', align: 'center',
                sorter: (a, b) => a.Points - b.Points,
            },
        ];
        
        const data =
        drivers.map((driver, i) => {
            return (
                {
                    id: driver.Driver.driverId, // setovan id koji odredjuje parametar koji pozivamo u funkciji
                    name: `${driver.Driver.givenName} ${driver.Driver.familyName}`, // record za filter
                    Number: i + 1,
                    Driver: (<div onClick={() => handleDriverId(driver.Driver.driverId)} 
                        style={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
                        <Flag
                            size={50}
                            country={getFlagCode(props.flags, driver.Driver.nationality)}
                            style={{ marginRight: '5px' }}
                            />
                        {driver.Driver.givenName} {driver.Driver.familyName}
                    </div>),
                    Team: `${driver.Constructors[0].name}`,
                    Points: `${driver.points}`,
                })
            })
            
            const onChange = (pagination, filters, sorter, extra) => {
                console.log('params', pagination, filters, sorter, extra);
    };
    
    
    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            {/* Drivers 1st table */}
            <div className="table">
                <h1 style={{ textAlign: 'center', color: '#ff8c00', marginTop: "50px" }}>Drivers Championship</h1>
                <Table columns={columns} dataSource={data} onChange={onChange}
                rowClassName={(record, index) => index % 2 === 0 ? 'odd-row' : ''} 
                 onRow={(record) => ({ 
                 onClick: () => handleDriverId(record.id),
                 })} style={{ cursor: 'pointer' }}
                 />

            </div>
        </div >
    )
}