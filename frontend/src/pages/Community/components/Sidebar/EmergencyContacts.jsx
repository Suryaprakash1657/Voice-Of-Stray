import React from 'react';
import Card from '../../../../components/ui/Card.jsx';

export default function EmergencyContacts() {
  const contacts = [
    {
      id: 1,
      name: "City Animal Control",
      phone: "1-800-555-0199 (24/7)"
    },
    {
      id: 2,
      name: "Paws Vet Clinic",
      phone: "1-800-555-0122 (8AM - 8PM)"
    }
  ];

  return (
    <Card style={{ borderLeft: '4px solid var(--alert)' }}>
      <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="ph-fill ph-phone-call" style={{ color: 'var(--alert)', fontSize: '1.25rem' }}></i>
        Emergency Contacts
      </h3>
      {contacts.map((item, index) => (
        <div 
          key={item.id} 
          className="contributor-item" 
          style={{ marginBottom: index === contacts.length - 1 ? 0 : '12px' }}
        >
          <div className="contributor-info">
            <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
            <span>{item.phone}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}
