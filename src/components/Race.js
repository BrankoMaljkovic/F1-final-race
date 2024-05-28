import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Race() {
  const { round } = useParams();
  const [qualifyingResults, setQualifyingResults] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [raceDetails, setRaceDetails] = useState(null);
  const [loading, setLoading] = useState (true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qualifyingResponse, raceResponse, raceDetailsResponse] = await Promise.all([
          axios.get(`http://ergast.com/api/f1/2013/${round}/qualifying.json`),
          axios.get(`http://ergast.com/api/f1/2013/${round}/results.json`),
          axios.get(`https://ergast.com/api/f1/2013/results/1.json`)
        ]);

        const qualifyingData = qualifyingResponse.data.MRData.RaceTable.Races[0].QualifyingResults;
        const raceData = raceResponse.data.MRData.RaceTable.Races[0].Results;
        const raceDetailsData = raceDetailsResponse.data.MRData.RaceTable.Races[0];

        setQualifyingResults(qualifyingData);
        setRaceResults(raceData);
        setRaceDetails(raceDetailsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };
    fetchData();
  }, [round]);

  if(loading){
    return <h1>Loading...</h1>
  }
  return (
    <div>
      <div>
        <h1>Race Details</h1>
        <img src={`../img/${raceDetails.raceName.toLowerCase()}.jpg`} alt={`${raceDetails.raceName} Circuit`} />
        <p>Name of Race: {raceDetails.raceName}</p>
        <p>Country: {raceDetails.Circuit.Location.country}</p>
        <p>Location: {raceDetails.Circuit.Location.locality}</p>
        <p>Date of Race: {raceDetails.date}</p>
        <p>Full Report: <a href={raceDetails.url}>Link to Full Report</a></p>
      </div>

      <h1>Race Results - Round {round}</h1>
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
          {qualifyingResults.map((result, index) => (
            <tr key={index}>
              <td>{result.position}</td>
              <td>{result.Driver.familyName}</td>
              <td>{result.Constructor.name}</td>
              <td>{result.Q3 || result.Q2 || result.Q1}</td>
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