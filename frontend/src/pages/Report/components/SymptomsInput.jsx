import React from 'react';
import { Textarea } from '../../../components/ui';

export default function SymptomsInput({ value, onChange, error }) {
  return (
    <Textarea
      label="Observed Condition"
      placeholder="e.g. Hit by vehicle and unable to walk, open wound on front leg, severe dehydration, appears abandoned, possible fracture"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      error={error}
      required
    />
  );
}
