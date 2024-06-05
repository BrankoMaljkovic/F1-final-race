import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";
import { Table } from 'antd';
import Breadcrumbs from './Breadcrumb';

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
        // console.log(url);
        const response = await axios.get(url);
        // console.log(`test`, response.data.MRData.StandingsTable.StandingsLists[0]);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    }

    const handleDriverId = (id) => { // TODO dodati u tabelu ofu funkciju
        console.log(`Constructor clicked: ${id}`);
        navigate(`/driverDetails/${id}`);
    };

    console.log(`table`, drivers);
    
    if (loading) {
        return <h1>Loading...</h1>
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
            title: 'Team', dataIndex: 'Team',
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
                title: 'Points', dataIndex: 'Points',
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
                    Driver: (<div onClick={() => handleDriverId(driver.Driver.driverId)} style={{ cursor: 'pointer' }}>
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
                <h1>Drivers Championship</h1>
                <Table columns={columns} dataSource={data} onChange={onChange} 
                 onRow={(record) => ({ // onRow za svaki red funkcija
                 onClick: () => handleDriverId(record.id), // record podaci iz objekta, id je driverId
                 })} style={{ cursor: 'pointer' }}
                 />

            </div>
        </div >
    )
}

/*
<table>
                    <thead>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </thead>
                    <tbody>
                        {drivers.map((driver, i) => {
                            console.log(driver);
                            return (
                                <tr
                                    onClick={() =>
                                        handleDriverId(
                                            driver.Driver.driverId
                                        )
                                    }
                                >
                                    <td>
                                        <Flag country={getFlagCode(props.flags, driver.Driver.nationality)} />
                                    </td>
                                    <td>{driver.position}</td>
                                    <td>{driver.Driver.givenName} {driver.Driver.familyName}</td>
                                    <td>{driver.Constructors[0].constructorId}</td>
                                    <td>{driver.points}</td>
                                </tr>
                            )

                        }
                        )}
                    </tbody>
                </table>
                */