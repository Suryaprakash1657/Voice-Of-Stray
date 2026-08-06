import React from 'react';

export default function Card({ children, className = '', onClick, ...props }) {
  const isClickable = typeof onClick === 'function';
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={isClickable ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', style, ...props }) {
  return (
    <div 
      className={`card-header ${className}`} 
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '', style, ...props }) {
  return (
    <div 
      className={`card-footer ${className}`} 
      style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
