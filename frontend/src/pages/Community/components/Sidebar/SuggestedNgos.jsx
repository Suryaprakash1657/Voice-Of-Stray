import React from 'react';
import Card from '../../../../components/ui/Card.jsx';

export default function SuggestedNgos() {
  const ngos = [
    {
      id: 1,
      name: "Paws & Claws NGO",
      followers: "2.1k followers",
      img: "https://images.unsplash.com/photo-1542838686-37ed7a9efc78?auto=format&fit=crop&q=80&w=100"
    }
  ];

  return (
    <Card className="suggested-widget">
      <h3>Suggested NGOs</h3>
      <div className="widget-scroll-container">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="contributor-item">
            <img src={ngo.img} alt={ngo.name} className="avatar-sm" />
            <div className="contributor-info">
              <strong>{ngo.name}</strong>
              <span>{ngo.followers}</span>
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
