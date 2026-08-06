import React from 'react';
import Card from '../../../../components/ui/Card.jsx';

export default function AlertsWidget() {
  const alerts = [
    {
      id: 1,
      title: "Injured cat reported",
      meta: "0.5 miles away • 10 mins ago"
    },
    {
      id: 2,
      title: "Lost golden retriever spotted",
      meta: "1.2 miles away • 25 mins ago"
    },
    {
      id: 3,
      title: "Puppies found in cardboard box",
      meta: "2.0 miles away • 1 hour ago"
    }
  ];

  return (
    <Card className="alert-widget">
      <h3>
        <i className="ph-fill ph-warning-circle"></i> Nearby Alerts
      </h3>
      <div className="widget-scroll-container">
        {alerts.map((item) => (
          <div key={item.id} className="alert-item">
            <div className="alert-item-content">
              <div className="alert-icon">
                <i className="ph ph-siren"></i>
              </div>
              <div className="alert-info">
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </div>
            </div>
            <button className="alert-cta">Help Now</button>
          </div>
        ))}
        <div className="widget-scroll-indicator">
          <i className="ph ph-caret-down"></i>
        </div>
      </div>
    </Card>
  );
}
