import React from 'react';
import { SearchInput } from '../../../components/ui';

export default function SearchBar({ value, onChange }) {
  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange('')}
      placeholder="Search posts, people, locations or hashtags..."
    />
  );
}
