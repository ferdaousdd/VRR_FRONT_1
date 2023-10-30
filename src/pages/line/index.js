import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { Helmet } from "react-helmet-async";

const Line = () => {
  return (
    <>
        <Helmet>
        <title> line Chart </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
</Helmet>
      <Box m="20px">
        <Header title="Line Chart" subtitle="Simple Line Chart" />
        <Box height="63vh">
          <LineChart />
        </Box>
      </Box>
    </>

  );
};

export default Line;
