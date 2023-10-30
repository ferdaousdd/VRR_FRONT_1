import { Form, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';

const PieChart = () => {
  const [Lines, setLines] = useState([]);
  const [selectedLineString, setSelectedLineString] = useState(""); // Provide initial value here
  const [segments, setSegments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/points/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setLines(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleDateChange = (event) => {
    console.log(event.target.value)
    const selected = event.target.value;

    setSelectedDate(event.target.value);
    updateFeatureCoordinates(selectedLineString ,selected);

  };

  const handleLineStringSelect = async (event) => {
    const lineStringId = event.target.value;
    console.log(lineStringId)
    setSelectedLineString(lineStringId);
    // Fetch segments for the selected LineString
    // try {
    //   const response = await fetch(http://127.0.0.1:8000/api/user/line-strings/${lineStringId}/segments/?selectedDate=${selectedDate}, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = await response.json();
    //   setSegments(data);
    // } catch (error) {
    //   console.log(error);
    // }
  };




  const updateFeatureCoordinates = (id, selectedDate) => {
    console.log(selectedDate)
    fetch(`http://127.0.0.1:8000/api/user/line-strings/${id}/segments/?date=${selectedDate}`)
      .then((response) => response.json())
      .then((data) => setSegments(data))
      .catch((error) => console.error(error));
  };







  return (
    <div>
    <div className="row">
  <div className="col-md-6 mb-3" >
        <Form.Group>
          <Form.Label>Select Point:</Form.Label>
          <Form.Select value={selectedLineString} onChange={handleLineStringSelect}>
            <option value="">Select a line</option>
            {Lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      <div className="col-md-6 mb-3" >
        <Form.Group controlId="datePicker">
          <Form.Label>Date:</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
          
        </Form.Group>
  </div>
  </div>

      <div  style={{ height: '400px' }}>
      {segments.labels && segments.labels.length > 0 && (
      <ResponsivePie
        data={segments.labels.map((label, index) => ({
          id: label,
          value: segments.values[index]
        }))}

          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextColor="#333333"
          radialLabelsLinkColor={{ from: 'color' }}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
        />
      )}
      </div>
    </div>
  );
};

export default PieChart;