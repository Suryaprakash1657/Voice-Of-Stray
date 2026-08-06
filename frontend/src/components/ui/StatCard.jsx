import React from 'react';
import Card from './Card.jsx';

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendType = 'up',
  accentColor = 'var(--primary)',
  className = '',
  ...props
}) {
  const isTrendUp = trendType === 'up';

  return (
    <Card 
      className={className} 
      style={{ position: 'relative', overflow: 'hidden', borderLeft: `4px solid ${accentColor}`, padding: '24px' }}
      {...props}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px', marginBottom: '4px' }}>
            {value}
          </h2>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
              <span style={{ color: isTrendUp ? 'var(--secondary)' : 'var(--alert)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <i className={isTrendUp ? 'ph ph-trend-up' : 'ph ph-trend-down'}></i> {trend}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            backgroundColor: `${accentColor}12`,
            color: accentColor,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem'
          }}>
            <i className={`ph-fill ${icon}`}></i>
          </div>
        )}
      </div>
    </Card>
  );
}
