import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Race() {
  const { raceId } = useParams();
  const [qualifyingResults, setQualifyingResults] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState (true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qualifyingResponse, raceResponse] = await Promise.all([
          axios.get(`http://ergast.com/api/f1/2013/${raceId}/qualifying.json`),
          axios.get(`http://ergast.com/api/f1/2013/${raceId}/results.json`)
        ]);
        
        const qualifyingData = qualifyingResponse.data.MRData.RaceTable.Races[0]; 
        const raceData = raceResponse.data.MRData.RaceTable.Races[0].Results;

        setQualifyingResults(qualifyingData);
        setRaceResults(raceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };
    fetchData();
  }, []);

  const getBestTime = (result) => {
    console.log("BT" , result.Q1,result.Q2, result.Q3)
    const nizBestTime = [result.Q1,result.Q2, result.Q3];
    const sortBestTime = nizBestTime.sort();
    console.log(`nizBestResult`, sortBestTime);
    return(
      `${sortBestTime[0]}`
    )
  }

  if(loading){
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <div>
        <h1>Race Details</h1>
        
          <p>Name of Race: {qualifyingResults.raceName}</p>
          <p>Country: {qualifyingResults.Circuit.Location.country}</p>
          <p>Location: {qualifyingResults.Circuit.Location.locality}</p>
          <p>Date of Race: {qualifyingResults.date}</p>
          <p>Full Report: <a href={qualifyingResults.Circuit.url}>Link to Full Report</a></p>
      </div>

      <h1>Race Results - Round {raceId}</h1>
      <h2>Qualifying Results</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Team</th>
            <th>Best Time</th>
          </tr>
        </thead>
        <tbody>
          {qualifyingResults.QualifyingResults.map((result, index) => (
            <tr key={index}>
              <td>{result.position}</td>
              <td>{result.Driver.familyName}</td>
              <td>{result.Constructor.name}</td>
              <td>{getBestTime(result)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Race Results</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Team</th>
            <th>Result</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {raceResults.map((result, index) => (
            <tr key={index}>
              <td>{result.position}</td>
              <td>{result.Driver.familyName}</td>
              <td>{result.Constructor.name}</td>
              <td>{result.Time?.time || 'N/A'}</td>
              <td>{result.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}