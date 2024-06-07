import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';
import Team from './Team';
import { Table } from 'antd';
import Breadcrumbs from './Breadcrumb';
import F1Loader from './F1Loader';

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
    return < F1Loader />;
  }

    // Breadcrumb - promenjiva sa detaljima
  const breadcrumbs = [
    {label: 'Home', link: '/'},
    { label: 'Teams'},
    ];

  const columns = [
    { title: 'Constructors', dataIndex: 'Number', align: 'center' },
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
      title: 'Details', dataIndex: ``, align: 'center',
      render: (text, record) => <a
        href={record.url}
        target='blank' >Details</a>


    },
    {
      title: 'Team Points', dataIndex: 'teamPoints', align: 'center',
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
              style={{display: 'flex', alignItems: 'center', cursor: 'pointer' }}
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
      <h1 style={{ textAlign: 'center', color: '#ff8c00', fontSize: 'bold' , marginTop: 50 }}>Constructors Championship</h1>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      {/* Teams 1st table */}
      <Table columns={columns} dataSource={data} onChange={onChange}  pagination={{ pageSize: 11 }}
      rowClassName={(record, index) => index % 2 === 0 ? 'odd-row' : ''}
      onRow={(record) => ({ // onRow za svaki red funkcija
        onClick: () => handleConstructorClick(record.constId), // record podaci iz objekta, id je driverId
        })}
        style={{ cursor: 'pointer' }}
        // scroll={{ y: 400 }}
        />

    </div>
  );
}
