interface CircleDiagramProps {
  radius: number;
  angleDegrees: number;
  sector?: boolean;
  radiusLabel?: string;
  angleLabel?: string;
  className?: string;
}

export default function CircleDiagram({
  radius,
  angleDegrees,
  sector = false,
  radiusLabel,
  angleLabel,
  className,
}: CircleDiagramProps) {
  const center = 130;
  const circleRadius = 88;
  const startAngle = -90;
  const endAngle = startAngle + angleDegrees;
  const startRadians = (startAngle * Math.PI) / 180;
  const endRadians = (endAngle * Math.PI) / 180;
  const startX = center + circleRadius * Math.cos(startRadians);
  const startY = center + circleRadius * Math.sin(startRadians);
  const endX = center + circleRadius * Math.cos(endRadians);
  const endY = center + circleRadius * Math.sin(endRadians);
  const labelAngle = startAngle + Math.min(angleDegrees, 180) / 2;
  const labelRadians = (labelAngle * Math.PI) / 180;
  const angleTextX = center + 32 * Math.cos(labelRadians);
  const angleTextY = center + 32 * Math.sin(labelRadians);
  const accessibleAngle = angleLabel ?? `${angleDegrees} degrees`;

  return (
    <svg
      viewBox="0 0 260 260"
      role="img"
      aria-label={`Circle diagram with radius ${radiusLabel ?? radius}, angle ${accessibleAngle}${sector ? ", and a shaded sector" : ""}`}
      className={className}
    >
      <circle className="diagramCircle" cx={center} cy={center} r={circleRadius} />
      <circle
        className="diagramSector"
        cx={center}
        cy={center}
        r={circleRadius / 2}
        pathLength={360}
        strokeWidth={circleRadius}
        strokeDasharray={`${sector ? angleDegrees : 0} 360`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${center} ${center})`}
      />
      <circle
        className="diagramArc"
        cx={center}
        cy={center}
        r={circleRadius}
        pathLength={360}
        strokeDasharray={`${angleDegrees} 360`}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <line className="diagramRadius" x1={center} y1={center} x2={startX} y2={startY} />
      <line className="diagramRadius" x1={center} y1={center} x2={endX} y2={endY} />
      <circle
        className="diagramAngle"
        cx={center}
        cy={center}
        r="26"
        pathLength={360}
        strokeDasharray={`${angleDegrees} 360`}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <circle className="diagramCenter" cx={center} cy={center} r="4" />
      <text className="diagramLabel" x={center + 7} y={center - 8}>
        O
      </text>
      <text className="diagramMeasure" x={(center + startX) / 2 + 7} y={(center + startY) / 2 - 5}>
        {radiusLabel ?? `r = ${radius}`}
      </text>
      <text className="diagramMeasure" x={angleTextX} y={angleTextY}>
        {angleLabel ?? `${angleDegrees}°`}
      </text>
    </svg>
  );
}
