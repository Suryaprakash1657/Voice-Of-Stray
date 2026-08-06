import React from 'react';
import Card from '../../../../components/ui/Card.jsx';

export default function TrendingRescues() {
  const trending = [
    {
      id: 1,
      title: "Luna's Recovery Journey",
      interactions: "12.5k interactions",
      img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: 2,
      title: "5 Kittens found in barn",
      interactions: "8.2k interactions",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: 3,
      title: "Abandoned dog rescued",
      interactions: "5.4k interactions",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100"
    },
    {
      id: 4,
      title: "Puppy needs foster home",
      interactions: "3.1k interactions",
      img: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=100"
    }
  ];

  return (
    <Card className="trending-widget">
      <h3>Trending Rescues</h3>
      <div className="widget-scroll-container">
        {trending.map((item) => (
          <div key={item.id} className="trending-item">
            <img src={item.img} alt={item.title} />
            <div className="trending-info">
              <strong>{item.title}</strong>
              <span>{item.interactions}</span>
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
