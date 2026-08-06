import React from 'react';
import Card from '../../../../components/ui/Card.jsx';

export default function TopContributors() {
  const contributors = [
    {
      id: 1,
      name: "Dr. Aris (Emergency Vet)",
      stat: "Helped 45 strays this month",
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: 2,
      name: "Priya Sharma (Rescue)",
      stat: "Organized 3 feeding drives",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    }
  ];

  return (
    <Card className="contributors-widget">
      <h3>Top Contributors</h3>
      <div className="widget-scroll-container">
        {contributors.map((user) => (
          <div key={user.id} className="contributor-item">
            <img src={user.img} alt={user.name} className="avatar-sm" />
            <div className="contributor-info">
              <strong>{user.name}</strong>
              <span>{user.stat}</span>
            </div>
          </div>
        ))}
        <div className="widget-scroll-indicator">
          <i className="ph ph-caret-down"></i>
        </div>
      </div>
    </Card>
  );
}
