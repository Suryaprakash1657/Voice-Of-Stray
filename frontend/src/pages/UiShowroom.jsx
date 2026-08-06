import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Badge, 
  Avatar, 
  Modal, 
  Input, 
  Textarea, 
  Select, 
  SearchInput, 
  Tabs, 
  EmptyState, 
  LoadingSpinner, 
  StatCard, 
  SectionHeader, 
  ConfirmationDialog, 
  PageContainer 
} from '../components/ui';

export default function UiShowroom() {
  const [activeTab, setActiveTab] = useState('buttons');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Form states
  const [inputText, setInputText] = useState('');
  const [textareaText, setTextareaText] = useState('');
  const [selectedOpt, setSelectedOpt] = useState('volunteer');

  const showroomTabs = [
    { id: 'buttons', label: 'Buttons & Spinners' },
    { id: 'cards', label: 'Cards & Badges' },
    { id: 'forms', label: 'Form Components' },
    { id: 'overlays', label: 'Modals & Dialogs' },
    { id: 'layouts', label: 'Layouts & States', isAlert: true }
  ];

  const handleConfirmAction = () => {
    alert("Action confirmed!");
    setIsConfirmOpen(false);
  };

  const sidebarWidget = (
    <Card className="alert-widget">
      <h3><i className="ph ph-shield-warning"></i> Developer Sandbox</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
        This showroom demonstrates the unified React components matching the Voice of Stray design guidelines. Use these components when building new pages.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Badge variant="NGO">Active Library</Badge>
        <Badge variant="rescue">16 Components</Badge>
      </div>
    </Card>
  );

  return (
    <PageContainer sidebar={sidebarWidget}>
      <SectionHeader 
        title="UI Component Showroom" 
        subtitle="Unified shared React components for all current and future page migrations."
        action={
          <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)} icon={<i className="ph ph-sparkle"></i>}>
            Open Showcase Modal
          </Button>
        }
      />

      {/* Tabs navigation */}
      <Tabs tabs={showroomTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      <Card style={{ padding: '28px', marginTop: '16px' }}>
        
        {/* BUTTONS TAB */}
        {activeTab === 'buttons' && (
          <div>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Buttons (btn-premium & btn-primary)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="success">Success Button</Button>
            </div>

            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Premium Sizes (btn-premium)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <Button variant="primary" size="lg" icon={<i className="ph ph-heart"></i>}>Premium Primary</Button>
              <Button variant="secondary" size="lg" icon={<i className="ph ph-arrow-right"></i>} iconPosition="right">Premium Secondary</Button>
            </div>

            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>States & Loaders</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <Button variant="primary" isLoading>Loading Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Spinners:</span>
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
            </div>
          </div>
        )}

        {/* CARDS TAB */}
        {activeTab === 'cards' && (
          <div>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Cards Structure</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '32px' }}>
              <Card>
                <Card.Header>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar alt="Arjun" size="sm" />
                    <strong>Arjun (Volunteer)</strong>
                  </div>
                  <Badge variant="rescue">Rescue</Badge>
                </Card.Header>
                <Card.Body>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    Cards support modular sub-components for header layout, body content, and footers. Hovering applies standard shadow and transform translations.
                  </p>
                </Card.Body>
                <Card.Footer>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reported 2 hours ago</span>
                </Card.Footer>
              </Card>
            </div>

            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Badges (Category & Status)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Badge variant="rescue">Rescue</Badge>
              <Badge variant="feeding">Feeding</Badge>
              <Badge variant="adoption">Adoption</Badge>
              <Badge variant="alert">Emergency</Badge>
              <Badge variant="pending">Pending Review</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="info">Available</Badge>
              <Badge variant="user">Regular User</Badge>
              <Badge variant="ngo">NGO Shelter Partner</Badge>
            </div>
          </div>
        )}

        {/* FORMS TAB */}
        {activeTab === 'forms' && (
          <div>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Form Input Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <SearchInput 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                onClear={() => setSearchText('')} 
                placeholder="Search components..." 
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Input 
                  label="Sample Input" 
                  placeholder="Enter details..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)} 
                />
                
                <Input 
                  label="Input with Error" 
                  placeholder="Enter details..." 
                  value="Invalid data sample" 
                  error="The field format is incorrect." 
                  readOnly
                />
              </div>

              <Select 
                label="Role Category" 
                value={selectedOpt} 
                onChange={(e) => setSelectedOpt(e.target.value)}
              >
                <option value="user">Regular User</option>
                <option value="volunteer">Volunteer</option>
                <option value="rescuer">Rescuer</option>
                <option value="ngo">NGO Partner</option>
              </Select>

              <Textarea 
                label="Comments / Description" 
                placeholder="Write description here..." 
                value={textareaText}
                onChange={(e) => setTextareaText(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* OVERLAYS TAB */}
        {activeTab === 'overlays' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', textAlign: 'left' }}>Modals & Confirmation Boxes</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Click below to interact with the overlay components.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Trigger Modal
              </Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Trigger Confirmation Dialog
              </Button>
            </div>
          </div>
        )}

        {/* LAYOUTS TAB */}
        {activeTab === 'layouts' && (
          <div>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Dashboard Metrics (StatCard)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <StatCard 
                title="Active Rescues" 
                value="24" 
                icon="ph-ambulance" 
                trend="+12%" 
                trendType="up" 
                accentColor="var(--secondary)" 
              />
              <StatCard 
                title="Urgent Reports" 
                value="5" 
                icon="ph-warning" 
                trend="-2%" 
                trendType="down" 
                accentColor="var(--alert)" 
              />
            </div>

            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>States (EmptyState)</h3>
            <EmptyState 
              title="No Pending Reports" 
              description="Good job! All stray reports in your local sector have been accepted and dispatched."
              actionButton={<Button variant="primary">Refresh Dashboard</Button>}
            />
          </div>
        )}

      </Card>

      {/* Reusable Modal instance */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Reusable Showcase Modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Apply Changes</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>
          This modal is built with escape key closure listener, click-outside handling, layout flex structures, and high contrast backdrop blur.
        </p>
      </Modal>

      {/* Confirmation Dialog instance */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Confirm Delete Action"
        message="Are you sure you want to delete this sample record? This will permanently wipe it from the local storage cache."
        confirmLabel="Wipe Record"
        cancelLabel="Keep Safe"
        onConfirm={handleConfirmAction}
        onCancel={() => setIsConfirmOpen(false)}
        isDanger={true}
      />

    </PageContainer>
  );
}
