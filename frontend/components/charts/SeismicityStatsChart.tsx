"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

interface SeismicityStatsChartProps {
  magnitudeBins?: { label: string; count: number }[];
}

export const SeismicityStatsChart: React.FC<SeismicityStatsChartProps> = ({
  magnitudeBins = [
    { label: "M4.0 - M4.9", count: 142 },
    { label: "M5.0 - M5.9", count: 38 },
    { label: "M6.0 - M6.9", count: 9 },
    { label: "M7.0+", count: 2 },
  ],
}) => {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "#334155",
      textStyle: { color: "#f8fafc" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "12%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: magnitudeBins.map((b) => b.label),
      axisLine: { lineStyle: { color: "#475569" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      name: "Event Count",
      nameTextStyle: { color: "#94a3b8", fontSize: 11 },
      axisLine: { lineStyle: { color: "#475569" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    series: [
      {
        name: "Earthquake Count",
        type: "bar",
        barWidth: "45%",
        data: magnitudeBins.map((b, idx) => ({
          value: b.count,
          itemStyle: {
            color:
              idx === 0
                ? "#34d399"
                : idx === 1
                ? "#facc15"
                : idx === 2
                ? "#fb923c"
                : "#f43f5e",
            borderRadius: [4, 4, 0, 0],
          },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "260px", width: "100%" }} />;
};
