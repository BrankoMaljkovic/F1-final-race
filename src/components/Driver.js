import { useEffect, useState } from "react";
import axios from "axios";

export default function Driver() {
    const [driverDetails, setDriverDetails] = useState("");
    const [driverRaces, setDriverRaces] = useState([]);




    useEffect(() => {
        const getDriverDetails = async () => {
            const url = ("http://ergast.com/api/f1/2013/drivers/alonso/driverStandings.json");
            const response = await axios.get(url);
            console.log("response", response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);

            setDriverDetails(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver);
        }



        const getDriverRaces = async () => {
            const url = ("http://ergast.com/api/f1/2013/drivers/albert_park/results.json");
            const response = await axios.get(url);
            //console.log("albertpark", response.data.MRData.RaceTable.Races);

            //setDriverRaces(response.data.MRData.RaceTable.Races);
        }

        getDriverDetails();
        getDriverRaces();

    }, []);

    return (
        <div>
            <div>
                <h1>Driver Details</h1>
                <p>Name: {driverDetails.familyName}</p>
                <p>Nationality: {driverDetails.nationality}</p>
                <p>Team: {driverDetails.name}</p>

                <h2>Driver Races</h2>
                <ul>
                    {/* {driverRaces.map((Races, i) => (
                        <li key={i}>{Races}</li>
                    ))} */}
                </ul>
            </div>
        </div>
    );
}
