import React from 'react';
import { Select } from '../../../components/ui';

export default function IssueCategorySelector({ value, onChange, error }) {
  const options = [
    "Injury",
    "Accident",
    "Illness",
    "Abandoned",
    "Abuse",
    "Malnourished",
    "Pregnant Animal",
    "Lost Pet",
    "Other"
  ];

  return (
    <Select
      label="Issue Category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      required
    >
      <option value="" disabled>Select Issue Category</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </Select>
  );
}
