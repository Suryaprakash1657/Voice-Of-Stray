import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className={`filter-tabs ${className}`} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        let tabClass = 'tab';
        
        if (isActive) {
          tabClass += ' active';
        }
        
        if (tab.isAlert) {
          tabClass += ' alert-tab';
        }

        return (
          <button
            key={tab.id}
            type="button"
            className={tabClass}
            onClick={() => onChange && onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
