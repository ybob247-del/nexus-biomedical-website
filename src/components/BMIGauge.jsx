import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * BMI Gauge Component
 * Visual representation of BMI with color-coded ranges
 * 
 * BMI Categories (WHO Standards):
 * - Underweight: < 18.5 (Blue)
 * - Normal: 18.5 - 24.9 (Green)
 * - Overweight: 25.0 - 29.9 (Yellow)
 * - Obese: ≥ 30.0 (Red)
 */
export default function BMIGauge({ bmi, height = 200 }) {
  const { t } = useTranslation();
  const needleRef = useRef(null);

  // BMI ranges for visualization
  const ranges = [
    { min: 10, max: 18.5, color: '#3B82F6', label: t('bmi.underweight', 'Underweight') },
    { min: 18.5, max: 25, color: '#10B981', label: t('bmi.normal', 'Normal') },
    { min: 25, max: 30, color: '#F59E0B', label: t('bmi.overweight', 'Overweight') },
    { min: 30, max: 40, color: '#EF4444', label: t('bmi.obese', 'Obese') }
  ];

  // Calculate needle rotation based on BMI (10-40 range mapped to -90 to 90 degrees)
  const calculateRotation = (bmiValue) => {
    const clampedBMI = Math.max(10, Math.min(40, bmiValue));
    return ((clampedBMI - 10) / 30) * 180 - 90;
  };

  // Animate needle on mount
  useEffect(() => {
    if (needleRef.current) {
      const rotation = calculateRotation(bmi);
      needleRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [bmi]);

  // Get current BMI category
  const getCurrentCategory = () => {
    if (bmi < 18.5) return ranges[0];
    if (bmi < 25) return ranges[1];
    if (bmi < 30) return ranges[2];
    return ranges[3];
  };

  const currentCategory = getCurrentCategory();
  const width = height * 2;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* SVG Gauge */}
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background arc segments */}
          {ranges.map((range, index) => {
            const startAngle = ((range.min - 10) / 30) * 180 - 90;
            const endAngle = ((range.max - 10) / 30) * 180 - 90;
            const radius = height * 0.8;
            const centerX = width / 2;
            const centerY = height * 0.9;
            const strokeWidth = 30;

            // Convert angles to radians
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate arc path
            const startX = centerX + radius * Math.cos(startRad);
            const startY = centerY + radius * Math.sin(startRad);
            const endX = centerX + radius * Math.cos(endRad);
            const endY = centerY + radius * Math.sin(endRad);

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                fill="none"
                stroke={range.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={0.3}
              />
            );
          })}

          {/* Highlight current range */}
          {(() => {
            const range = currentCategory;
            const startAngle = ((range.min - 10) / 30) * 180 - 90;
            const endAngle = ((range.max - 10) / 30) * 180 - 90;
            const radius = height * 0.8;
            const centerX = width / 2;
            const centerY = height * 0.9;
            const strokeWidth = 30;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const startX = centerX + radius * Math.cos(startRad);
            const startY = centerY + radius * Math.sin(startRad);
            const endX = centerX + radius * Math.cos(endRad);
            const endY = centerY + radius * Math.sin(endRad);

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            return (
              <path
                d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                fill="none"
                stroke={range.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={1}
              />
            );
          })()}

          {/* BMI markers */}
          {[10, 18.5, 25, 30, 40].map((markerBMI) => {
            const angle = ((markerBMI - 10) / 30) * 180 - 90;
            const radius = height * 0.8;
            const centerX = width / 2;
            const centerY = height * 0.9;
            const angleRad = (angle * Math.PI) / 180;

            const innerRadius = radius - 35;
            const outerRadius = radius + 5;

            const x1 = centerX + innerRadius * Math.cos(angleRad);
            const y1 = centerY + innerRadius * Math.sin(angleRad);
            const x2 = centerX + outerRadius * Math.cos(angleRad);
            const y2 = centerY + outerRadius * Math.sin(angleRad);

            const labelRadius = radius + 20;
            const labelX = centerX + labelRadius * Math.cos(angleRad);
            const labelY = centerY + labelRadius * Math.sin(angleRad);

            return (
              <g key={markerBMI}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94A3B8"
                  strokeWidth={2}
                />
                <text
                  x={labelX}
                  y={labelY}
                  fill="#64748B"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-medium"
                >
                  {markerBMI}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <g
            ref={needleRef}
            style={{
              transformOrigin: `${width / 2}px ${height * 0.9}px`,
              transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <line
              x1={width / 2}
              y1={height * 0.9}
              x2={width / 2}
              y2={height * 0.9 - height * 0.75}
              stroke={currentCategory.color}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <circle
              cx={width / 2}
              cy={height * 0.9}
              r={8}
              fill={currentCategory.color}
            />
          </g>
        </svg>

        {/* Center BMI value */}
        <div
          className="absolute text-center"
          style={{
            left: '50%',
            top: '75%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-4xl font-bold" style={{ color: currentCategory.color }}>
            {bmi.toFixed(1)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('bmi.label', 'BMI')}
          </div>
        </div>
      </div>

      {/* Category label */}
      <div className="text-center">
        <div
          className="inline-flex items-center px-4 py-2 rounded-full text-white font-semibold"
          style={{ backgroundColor: currentCategory.color }}
        >
          {currentCategory.label}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {ranges.map((range, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
              range.label === currentCategory.label
                ? 'bg-slate-100 dark:bg-slate-800'
                : 'opacity-60'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: range.color }}
            />
            <div className="text-sm">
              <div className="font-medium text-slate-900 dark:text-white">
                {range.label}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {range.min === 10 ? '<' : ''}{range.min} - {range.max === 40 ? '>' : ''}{range.max}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
