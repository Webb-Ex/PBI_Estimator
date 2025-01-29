// components/TilemapChart.tsx
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TilemapModule from "highcharts/modules/tilemap";

// Initialize the Tilemap module
if (typeof Highcharts === "object") {
  TilemapModule(Highcharts);
}

const TilemapChart: React.FC = () => {
  const options: Highcharts.Options = {
    chart: {
      type: "tilemap",
      height: 400,
    },
    title: {
      text: "Tilemap Chart Example",
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    colorAxis: {
      min: 0,
      minColor: "#FFFFFF",
      maxColor: "#007AFF",
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "<b>{point.name}</b>: {point.value}",
    },
    plotOptions: {
      tilemap: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },
    series: [
      {
        type: "tilemap",
        data: [
          { name: "A1", x: 0, y: 0, value: 10 },
          { name: "A2", x: 1, y: 0, value: 20 },
          { name: "B1", x: 0, y: 1, value: 30 },
          { name: "B2", x: 1, y: 1, value: 40 },
        ],
        name: "Data",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TilemapChart;
