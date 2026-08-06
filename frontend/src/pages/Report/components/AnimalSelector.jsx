import React from 'react';
import { Select } from '../../../components/ui';

export default function AnimalSelector({ value, onChange, error }) {
  const options = ["Dog", "Cat", "Cow", "Goat", "Horse", "Rabbit", "Bird", "Monkey", "Other"];

  return (
    <Select
      label="Animal Type"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      required
    >
      <option value="" disabled>Select Animal Type</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </Select>
  );
}
