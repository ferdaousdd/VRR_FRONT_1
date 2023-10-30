import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Form, Col } from 'react-bootstrap';

const WaterLevelChart = () => {
  const [selectedPoint, setSelectedPoint] = useState("");
  const [data, setData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lines, setLines] = useState([]);
  const [segmentsData, setSegmentsData] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/linestrings/", {
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



  
  const handlePointChange = (event) => {
    const selectedId = event.target.value;
    setSelectedPoint(selectedId);
    updateFeatureCoordinates(selectedId)
    setData([])


  };




  // const updateFeatureCoordinates = (id, selectedDate) => {
  //   console.log(selectedDate)
  //   fetch(`http://127.0.0.1:8000/api/user/linestring/water-levels/${id}/?selectedDate=${selectedDate}`)
  //     .then((response) => response.json())
  //     .then((data) => setData(data))
  //     .catch((error) => console.error(error));
  // };

const updateFeatureCoordinates = (id) => {
  
  const now = moment().format("YYYY-MM-DD"); // Get the current date in the desired format
  console.log(now)
  fetch(`http://127.0.0.1:8000/api/user/linestring/water-levels/${id}/?selectedDate=${now}`)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.error(error));
};
   useEffect(() => {
    // Fetch the segment data from the backend API
    fetch('http://127.0.0.1:8000/api/user/segment/')
    .then((response) => response.json())
    .then((data) => setSegmentsData(data))
    .catch((error) => console.error(error));
  }, []);

   const chartData = Object.entries(data).map(([zone, levels]) => {
    const zones = segmentsData.find((segment) => segment.id === parseInt(zone));
    return {
      id: zones.name,
      data: levels.map(({ date, level }) => ({
        x: moment(date).toDate(),
        y: level,
      })),
    };
  });
  



  return (
    <>
      <div className="d-flex justify-content-center ">
    {/* <div className="d-flex  ml-5 mt-2"> */}

    <Form.Group>
      <Form.Label  style={{ color: colors.greenAccent[400] }}>Select Point:</Form.Label>
      <Form.Select value={selectedPoint} onChange={handlePointChange}>
        <option value="">Select a line</option>
        {lines.map((line) => (
          <option key={line.id} value={line.id}>
            {line.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
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
      margin={{ top: 20, right: 110, bottom: 110, left: 60 }}
      xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
      xFormat="time:%Y-%m-%d/%H:%M:%S"
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
      colors={{ scheme: "nivo" }}

      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      enableGridX={false}
      axisBottom={{
        format: "%H:%M",
        tickValues: "every 1 hours",
        legend: "Time",

        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        legend: "Water level",
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
      ]}/>
    </>
  );
};

export default WaterLevelChart;