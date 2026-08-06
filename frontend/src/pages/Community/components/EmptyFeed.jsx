import React from 'react';
import { EmptyState } from '../../../components/ui';

export default function EmptyFeed() {
  return (
    <EmptyState
      title="No matching posts found"
      description="Try another keyword or switch to a different category."
      icon="ph-magnifying-glass"
    />
  );
}
