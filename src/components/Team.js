import { useEffect, useState } from "react";
import axios from "axios";

export default function Team() {

    const [teamDetail, setTeamDetails] = useState([]); // http://ergast.com/api/f1/' + year + '/constructors/' + id + '/constructorStandings.json' 
    const [teamResults, setTeamResults] = useState([]);

    useEffect(() => {
        // console.log("useEffect"); poziva se funkcija
        getTeamDetails();
    },[]);

    const getTeamDetails = async () => {
        // console.log("getTeamDetails"); // radi funkcija
        const url = "http://ergast.com/api/f1/2013/constructors/Ferrari/constructorStandings.json"
        // console.log(url); // dobavlja URL
        const response = await axios.get(url);
        console.log(`response`, response.data);

    };

    return(
        <h1>Strana team Branko</h1>
    )


}