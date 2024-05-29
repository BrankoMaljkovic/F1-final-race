import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';

export default function Drivers() {
    console.log('drivers');


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
        console.log(`test`, response.data.MRData.StandingsTable.StandingsLists[0]);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    }

    const handleDriverId = (id) => {
        console.log(`Constructor clicked: ${id}`);
        navigate(`/driverDetails/${id}`);
    };

    const getCountryFlag = (nationality) => {
        const country = countryData.find(
            (country) => country.nationality === nationality
        );
        return country ? country.flag : '';
    };

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Drivers Championship</h1>
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
                                    <img
                                        src={getCountryFlag(driver.Driver.nationality)}
                                        alt={driver.Driver.nationality}
                                        style={{ width: '30px', height: '20px' }}
                                    />
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
        </div>
    )
}