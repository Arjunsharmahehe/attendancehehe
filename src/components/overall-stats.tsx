import { memo, useMemo } from "react";
import { TextAttributes } from "@opentui/core";
import { type Subject, useApp } from "../context/app-context";

interface OverallStatsProps {
  subjects: Subject[];
}

export const OverallStats = memo(function OverallStats({
  subjects,
}: OverallStatsProps) {
  const { getSubjectStats, attendance } = useApp();

  const { overallStats, subjectStats } = useMemo(() => {
    let totalP = 0;
    let totalC = 0;
    let totalSafeBunks = 0;

    const subStats = subjects.map((s) => {
      const stat = getSubjectStats(s.id);
      totalP += stat.present;
      totalC += stat.total;
      if (stat.buffer > 0) totalSafeBunks += stat.buffer;
      return { ...stat, code: s.code, id: s.id };
    });

    const percent = totalC === 0 ? 0 : (totalP / totalC) * 100;

    return {
      overallStats: { percent, totalSafeBunks },
      subjectStats: subStats,
    };
  }, [subjects, attendance, getSubjectStats]);

  if (subjects.length === 0)
    return <text attributes={TextAttributes.DIM}>No Data</text>;

  return (
    <box flexDirection="column">
      {/* Overall */}
      <box flexDirection="column" marginBottom={2}>
        <text fg="blue" attributes={TextAttributes.BOLD}>
          Overall
        </text>
        <box flexDirection="row" gap={3} marginTop={1}>
          <text
            attributes={TextAttributes.BOLD}
            fg={overallStats.percent >= 75 ? "green" : "red"}
          >
            {overallStats.percent.toFixed(1)}%
          </text>
          <text fg="green">Buffer: {overallStats.totalSafeBunks}</text>
        </box>
      </box>

      {/* Breakdown */}
      <text fg="blue" attributes={TextAttributes.BOLD} marginBottom={1}>
        Breakdown
      </text>
      <box flexDirection="row" marginBottom={1}>
        <text attributes={TextAttributes.DIM} width={10}>
          Code
        </text>
        <text attributes={TextAttributes.DIM} width={8}>
          %
        </text>
        <text attributes={TextAttributes.DIM}>Buf</text>
      </box>

      {subjectStats.map((stat) => (
        <box key={stat.id} flexDirection="row" height={1}>
          <text width={10}>{stat.code}</text>
          <text width={8} fg={stat.percentage >= 75 ? "green" : "red"}>
            {stat.percentage.toFixed(0)}%
          </text>
          <text fg="yellow">{stat.buffer}</text>
        </box>
      ))}
    </box>
  );
});
