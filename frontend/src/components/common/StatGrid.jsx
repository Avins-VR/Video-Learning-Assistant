import React from "react";
import MaterialIcon from "./MaterialIcon.jsx";

/**
 * React equivalent of ui_theme.py's render_stat_grid(): a responsive
 * grid of KPI tiles. `stats` is a list of { icon, value, label }.
 */
export default function StatGrid({ stats }) {
  return (
    <div className="ed-stat-grid">
      {stats.map((stat, idx) => (
        <div className="ed-stat-tile" key={idx}>
          <div className="ed-stat-icon-wrap">
            <MaterialIcon name={stat.icon} size="20px" />
          </div>
          <div>
            <span className="ed-stat-value">{stat.value}</span>
            <div className="ed-stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
