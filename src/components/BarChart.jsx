import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Form } from 'react-bootstrap';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import moment from "moment";

const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedParameter, setSelectedParameter] = useState('');
  const [data, setData] = useState([]);
  const [segments, setSegments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/points/');
        const data = await response.json();
        setSegments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  
  }, []);
  
  const handleZoneChange = (event) => {
    const selectedZone = event.target.value;
    setSelectedZone(selectedZone);
    setData([]);
  };

  const handleParameterChange = (event) => {
    const selectedParameter = event.target.value;
    setSelectedParameter(selectedParameter);
    setData([]);
  };
  const handleDateChange = (event) => {
    console.log(event.target.value)
    const selected = event.target.value;
    setSelectedDate(selected);

  };
  const fetchData = () => {
    if (selectedZone && selectedParameter && selectedDate) {
      fetch(`http://127.0.0.1:8000/api/user/parame/?selectedZone=${selectedZone}&selectedParameter=${selectedParameter}&selectedDate=${selectedDate}`)
        .then((response) => response.json())
        .then((data) => setData(data.data))
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedZone, selectedParameter, selectedDate]);
  const chartData = [
    {
      id: selectedParameter,
      data: data.map(({ date, value }) => ({
        x: moment(date).toDate(),
        y: value,
      })),
    },
  ];

  return (
    <>
    <div className="row">
  <div className="col-md-4 mb-3" >
        <Form.Group>
          <Form.Label>Select Zone:</Form.Label>
          <Form.Select value={selectedZone} onChange={handleZoneChange}>
            <option value="">Select a Noeud</option>
            {segments.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <div className="col-md-4 mb-3" >
        <Form.Group>
          <Form.Label>Select Parameter:</Form.Label>
          <Form.Select value={selectedParameter} onChange={handleParameterChange}>
            <option value="">Select a parameter</option>
            <option value="Temprature">Temperature</option>
            <option value="pression">Pressure</option>
            <option value="taux_humidite">Humidity</option>
          </Form.Select>
        </Form.Group>
      </div>
      <div className="col-md-4 mb-3" >
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


      <ResponsiveLine
  theme={{
    axis: {
      domain: {
        line: {
          stroke: colors.grey[100],
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
        },
      },
      ticks: {
        line: {
          stroke: colors.grey[100],
          strokeWidth: 1,
        },
        text: {
          fill: colors.grey[100],
        },
      },
    },
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
    tooltip: {
      container: {
        background: colors.primary[400],
        color: colors.grey[100],
      },
    },
  }}
  data={chartData}
  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
  // xScale={{ type: "point" }}
  xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}

  yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}

  curve="linear"
  axisTop={null}
  axisRight={null}
  yFormat=" >-.2f"
  axisBottom={{
    format: "%H:%M",
    orient: "bottom",
    tickSize: 5,
    tickValues: "every 1 hours",
    tickPadding: 5,
    tickRotation: 0,
    legend: "Date",
    legendOffset: 36,
    legendPosition: "middle",
  }}
  colors={{ scheme: "nivo" }}

  enablePoints={false}
  enableGridX={false}

  axisLeft={{
    legend: "value",
    orient: "left",
    tickSize: 5,
    tickValues: 5,
    tickPadding: 5,
    tickRotation: 0,
    legendOffset: -40,
    legendPosition: "middle",
    }}
  pointSize={10}
  pointColor={{ theme: "background" }}
  pointBorderWidth={2}
  pointBorderColor={{ from: "serieColor" }}
  pointLabelYOffset={-12}
  useMesh={true}
  legends={[
  {
    anchor: "bottom-right",
    direction: "column",
    justify: false,
    translateX: 100,
    translateY: 0,
    itemsSpacing: 0,
    itemDirection: "left-to-right",
    itemWidth: 80,
    itemHeight: 20,
    itemOpacity: 0.75,
    symbolSize: 12,
    symbolShape: "circle",
    symbolBorderColor: "rgba(0, 0, 0, .5)",
    effects: [
      {
        on: "hover",
        style: {
          itemBackground: "rgba(0, 0, 0, .03)",
          itemOpacity: 1,
        },
      },
    ],
  },
  ]}
/>

    </>
  );
};

export default BarChart;