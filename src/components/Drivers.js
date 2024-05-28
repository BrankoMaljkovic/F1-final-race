import { useState, useEffect } from "react";
import axios from "axios";

export default function Drivers() {
    console.log('drivers');


    const [drivers, setDrivers] = useState([]);


    useEffect(() => {
        getDrivers();
    }, []);


    const getDrivers = async () => {
        const url = "http://ergast.com/api/f1/2013/driverStandings.json";
        // console.log(url);
        const response = await axios.get(url);
        console.log(`test`, response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
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
                            <tr>
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