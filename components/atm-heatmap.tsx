"use client";

import React, { useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import * as am5map from "@amcharts/amcharts5/map";

const ATMHeatMap = () => {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.default.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
      })
    );


    // Hide grid lines
    chart.gridContainer.set("opacity", 0);

    // Create axes (X, Y)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        min: 0,
        max: 12,
        strictMinMax: true,
        opacity: 0,
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { inside: true, inversed: true }),
        min: -1,
        max: 7,
        strictMinMax: true,
        opacity: 0,
      })
    );

    // Create series for hexagonal heatmap
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        calculateAggregates: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "y",
        valueXField: "x",
        valueField: "value",
      })
    );

    // Add a bullet for hexagon shapes
    const template = am5.Template.new<am5.Line>({});
    series.bullets.push(function () {
      const hexagon = am5.Line.new(root, {
        fill: series.get("fill"),
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
        tooltipText: "{name} {value}",
        tooltipY: -am5.p50,
      }, template);

      // Calculate the points for hexagon shape
      const w = Math.abs(xAxis.getX(0, 1, 0) - xAxis.getX(1, 1, 0)) / 2;
      const h = Math.abs(yAxis.getY(0, 1, 0) - yAxis.getY(1, 1, 0)) / 2;
      const p0 = { x: 0, y: -h };
      const p1 = { x: w, y: -h / 2 };
      const p2 = { x: w, y: h / 2 };
      const p3 = { x: 0, y: h };
      const p4 = { x: -w, y: h / 2 };
      const p5 = { x: -w, y: -h / 2 };

      hexagon.set("segments", [[[p0, p1, p2, p3, p4, p5]]]);

      return am5.Bullet.new(root, {
        sprite: hexagon,
      });
    });

    // Apply heatmap color based on value
    series.set("heatRules", [
      {
        target: template,
        min: am5.color(0xfffb77),
        max: am5.color(0xfe131a),
        dataField: "value",
        key: "fill",
      },
    ]);

    series.strokes.template.set("strokeOpacity", 0);

    // Example data: You can replace this with your own dataset
    const data = [
      { short: "A", name: "Location A", y: 6, x: 7, value: 4849300 },
      { short: "B", name: "Location B", y: 4, x: 5, value: 39250000 },
      // Add more data points as needed
    ];

    // Adjust the data for hexagonal grid alignment
    let vStep = (1 + am5.math.sin(30)) / 2;
    am5.array.each(data, function (di) {
      if (di.y / 2 === Math.round(di.y / 2)) {
        di.x += 0.5;
      }
      di.y = vStep * di.y;
    });

    series.data.setAll(data);

    // Animate the chart and series appearance
    series.appear(1000);
    chart.appear(1000, 100);

    // Cleanup on component unmount
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default ATMHeatMap;
