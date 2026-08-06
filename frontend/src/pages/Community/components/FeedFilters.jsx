import React from 'react';
import { Tabs } from '../../../components/ui';

export default function FeedFilters({ activeTab, onChange }) {
  const tabs = [
    { id: 'For You', label: 'For You' },
    { id: 'Rescue', label: 'Rescue' },
    { id: 'Feeding', label: 'Feeding' },
    { id: 'Adoption', label: 'Adoption' },
    { id: 'Stories', label: 'Stories' },
    { id: 'Alerts', label: 'Alerts', isAlert: true }
  ];

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={onChange} />;
}
