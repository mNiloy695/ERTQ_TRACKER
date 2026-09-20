"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

interface HazardCurveChartProps {
  curveData?: { pga: number; rate: number }[];
  locationName?: string;
  selectedReturnPeriod?: number; // 475 or 2475
}

export const HazardCurveChart: React.FC<HazardCurveChartProps> = ({
  curveData = [
    { pga: 0.01, rate: 0.1 },
    { pga: 0.05, rate: 0.04 },
    { pga: 0.1, rate: 0.015 },
    { pga: 0.2, rate: 0.005 },
    { pga: 0.35, rate: 0.0021 }, // 475 yr return period ~ 0.002105
    { pga: 0.5, rate: 0.0008 },
    { pga: 0.65, rate: 0.000404 }, // 2475 yr return period ~ 0.000404
    { pga: 0.8, rate: 0.00015 },
  ],
  locationName = "Dhaka City Region",
  selectedReturnPeriod = 475,
}) => {
  // 475-yr rate = 1 / 475 = 0.002105
  // 2475-yr rate = 1 / 2475 = 0.000404
  const targetRate = selectedReturnPeriod === 2475 ? 0.000404 : 0.002105;

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "#334155",
      textStyle: { color: "#f8fafc" },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div class="font-bold text-amber-400 border-b border-slate-700 pb-1 mb-1">${locationName} PSHA Curve</div>
          <div>PGA (Ground Motion): <b>${item.value[0]} g</b></div>
          <div>Annual Exceedance Rate (&lambda;): <b>${item.value[1]} yr<sup>-1</sup></b></div>
          <div>Return Period (1/&lambda;): <b>${Math.round(1 / item.value[1])} yrs</b></div>
        `;
      },
    },
    grid: {
      left: "4%",
      right: "6%",
      bottom: "10%",
      top: "14%",
      containLabel: true,
    },
    xAxis: {
      type: "log",
      name: "Peak Ground Acceleration (g)",
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: { color: "#94a3b8", fontSize: 12 },
      axisLine: { lineStyle: { color: "#475569" } },
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    yAxis: {
      type: "log",
      name: "Annual Rate of Exceedance (\u03BB)",
      nameTextStyle: { color: "#94a3b8", fontSize: 12 },
      axisLine: { lineStyle: { color: "#475569" } },
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
      axisLabel: { color: "#94a3b8", fontSize: 11 },
    },
    series: [
      {
        name: "PSHA Hazard Curve",
        type: "line",
        smooth: true,
        data: curveData.map((d) => [d.pga, d.rate]),
        lineStyle: { width: 3, color: "#f59e0b" },
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#fbbf24" },
        markLine: {
          silent: true,
          symbol: ["none", "none"],
          lineStyle: { color: "#f43f5e", type: "dashed", width: 2 },
          data: [
            {
              yAxis: targetRate,
              label: {
                formatter: `${selectedReturnPeriod}-Yr Return Period (\u03BB = ${targetRate.toFixed(4)})`,
                color: "#f43f5e",
                position: "end",
              },
            },
          ],
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "360px", width: "100%" }} />;
};
