import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';
import Team from './Team';
import { Table } from 'antd';
import Breadcrumbs from './Breadcrumb';

export default function Teams(props) {
  const [constructors, setConstructors] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://ergast.com/api/f1/2013/constructorStandings.json')
      .then((response) => {
        console.log('Fetched constructor standings:', response.data);
        setConstructors(
          response.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching constructor standings:', error);
      });
  }, []);

  const handleConstructorClick = (id) => {
    console.log(`Constructor clicked: ${id}`);
    navigate(`/teamDetails/${id}`);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const breadcrumbs = [
    {label: 'Home'},
    { label: 'Drivers', link: '/' },
    { label: 'Teams', link: '/teams '},
    { label: 'Races', link: '/races' },
    ];

  const columns = [
    { title: 'Constructors', dataIndex: 'Number', },
    {
      title: 'Team', dataIndex: 'Team',
      filters: [
        ...constructors.map((team, i) => { // Spread Operator - za prikaz elemenata objekta (u suprotnom se prikazuje ceo objekat)
          return (
            {
              text: `${team.Constructor.name}`,
              value: `${team.Constructor.name}`
            })
        })
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.TeamFilter.includes(value), // setujemo record.name
      width: '30%',
    },
    {
      title: 'Details', dataIndex: ``,
      render: (text, record) => <a
        href={record.url}
        target='blank' >Details</a>


    },
    {
      title: 'Team Points', dataIndex: 'teamPoints',
      sorter: (a, b) => a.teamPoints - b.teamPoints,
    },
  ];

  const data =
    constructors.map((constructor, i) => {
      return (
        {
          Number: i + 1,
          Team: (
            <div
              onClick={() => handleConstructorClick(constructor.Constructor.constructorId)}
              style={{ cursor: 'pointer' }}
            >
              <Flag
                size={50}
                country={getFlagCode(props.flags, constructor.Constructor.nationality)}
                style={{ marginRight: '5px' }}
              />
              {constructor.Constructor.name}
            </div>
          ),
          url: constructor.Constructor.url,
          teamPoints: constructor.points,
          TeamFilter: constructor.Constructor.name,
          constId: constructor.Constructor.constructorId
        })
    })

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };




  return (
    <div className='App'>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      {/* Teams 1st table */}
      <Table columns={columns} dataSource={data} onChange={onChange}  pagination={{ pageSize: 11 }}
      onRow={(record) => ({ // onRow za svaki red funkcija
        onClick: () => handleConstructorClick(record.constId), // record podaci iz objekta, id je driverId
        })}
        style={{ cursor: 'pointer' }}
        // scroll={{ y: 400 }}
        />
      

        {/* <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {constructors.map((constructor, index) => (
              <tr key={constructor.Constructor.constructorId}>
                <td>
                  <Flag
                    country={getFlagCode(
                      props.flags,
                      constructor.Constructor.nationality
                    )}
                  />
                </td>
                <td
                  onClick={() =>
                    handleConstructorClick(
                      constructor.Constructor.constructorId
                    )
                  }
                >
                  {index + 1}
                </td>
                <td
                  onClick={() =>
                    handleConstructorClick(
                      constructor.Constructor.constructorId
                    )
                  }
                >
                  {constructor.Constructor.name}
                </td>
                <td
                  onClick={() =>
                    handleConstructorClick(
                      constructor.Constructor.constructorId
                    )
                  }
                >
                  {constructor.points}
                </td>
                <td>
                  <a
                    href={constructor.Constructor.url}
                    target='blank'
                    onClick={() =>
                      console.log(`Details clicked for:
                        ${constructor.Constructor.constructorId}`)
                    }
                  >
                    {' '}
                    Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      {/* </div> */}
    </div>
  );
}
