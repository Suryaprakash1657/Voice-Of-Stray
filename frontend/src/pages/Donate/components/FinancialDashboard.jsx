import React from 'react';

export function FinancialDashboard({ onDownloadReport }) {
  const handleDownload = (fileName) => {
    alert(`Downloading ${fileName}... (Audit report verified)`);
  };

  return (
    <section className="financial-dashboard fade-in">
      <div className="transparency-badge">
        <i className="ph-bold ph-lock-key"></i> RADICAL TRANSPARENCY
      </div>
      <h2>Financial Dashboard 2024</h2>
      <p className="dashboard-subtitle">
        Live allocation of every dollar donated. We maintain a lean operation to ensure maximum impact for animals.
      </p>

      <div className="dashboard-grid">
        <div className="allocation-card">
          <div className="card-header-split">
            <h3>FUND ALLOCATION BREAKDOWN</h3>
            <span className="live-audit">
              <span className="dot"></span> Live Audit
            </span>
          </div>

          <div className="allocation-content">
            <div className="allocation-chart">
              <div className="chart-center">
                <div className="big-percent">100%</div>
                <div className="small-text">FUNDED</div>
              </div>
            </div>
            <div className="allocation-list">
              <div className="alloc-item">
                <div className="alloc-label">
                  <span className="color-dot brown"></span> Rescue & Meds
                </div>
                <div className="alloc-val brown-text">55%</div>
              </div>
              <div className="alloc-line"></div>
              <div className="alloc-item">
                <div className="alloc-label">
                  <span className="color-dot blue"></span> Sanctuary Care
                </div>
                <div className="alloc-val blue-text">20%</div>
              </div>
              <div className="alloc-line"></div>
              <div className="alloc-item">
                <div className="alloc-label">
                  <span className="color-dot green"></span> Feeding Programs
                </div>
                <div className="alloc-val green-text">15%</div>
              </div>
              <div className="alloc-line"></div>
              <div className="alloc-item">
                <div className="alloc-label">
                  <span className="color-dot red"></span> Admin
                </div>
                <div className="alloc-val red-text">10%</div>
              </div>
              <div className="alloc-line"></div>
            </div>
          </div>
        </div>

        <div className="audit-cards">
          <div className="audit-files-card">
            <div className="card-header-split">
              <h3>Recent Audit Files</h3>
              <i className="ph-bold ph-arrows-clockwise" style={{ color: 'var(--text-muted, #64748b)' }}></i>
            </div>
            <div className="file-list">
              <div
                className="file-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDownload('FY 2023-24 Annual Report.pdf')}
              >
                <div className="file-name">
                  <i className="ph-fill ph-file-pdf brown-text"></i> FY 2023-24 Annual Report
                </div>
                <i className="ph-bold ph-download-simple"></i>
              </div>
              <div
                className="file-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDownload('Q1 Transparency Statement.pdf')}
              >
                <div className="file-name">
                  <i className="ph-fill ph-file-pdf brown-text"></i> Q1 Transparency Statement
                </div>
                <i className="ph-bold ph-download-simple"></i>
              </div>
            </div>
          </div>

          <div className="verified-status-card">
            <div className="status-icon">
              <i className="ph-fill ph-check-circle"></i>
            </div>
            <div className="status-text">
              <h4>Verified NGO Status</h4>
              <p>We are a registered 501(c)(3) equivalent organization. Your donations are fully tax-deductible.</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-outline w-100"
            style={{
              padding: '16px',
              border: '2px solid var(--primary, #f97316)',
              color: 'var(--primary, #f97316)',
              borderRadius: 'var(--radius-md, 12px)',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '1.05rem'
            }}
            onClick={() => handleDownload('Full Transparency Report 2024.pdf')}
          >
            <i className="ph-bold ph-download-simple"></i> Download Full Transparency Report
          </button>
        </div>
      </div>

      {/* Trust Indicators Row */}
      <div className="trust-indicators-row">
        <div className="trust-item">
          <i className="ph-fill ph-shield-check"></i>
          <strong>Verified NGO</strong>
        </div>
        <div className="trust-item">
          <i className="ph-fill ph-file-text"></i>
          <strong>80G Tax Benefit</strong>
        </div>
        <div className="trust-item">
          <i className="ph-fill ph-lock-key"></i>
          <strong>Secure Payments</strong>
        </div>
      </div>
    </section>
  );
}

export default FinancialDashboard;
