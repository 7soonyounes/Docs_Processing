import React from 'react';

const PageLayout = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#E5e5e5', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
        <div style={{ fontWeight: 'bold', color: '#091b1a', fontSize: '20px' }}>Docs Processing</div>
        <div>
          <a href="/images" style={{ color: '#091b1a', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', textDecoration: 'none' }}>Images</a>
        </div>
      </header>
      <main style={{ flex: 1, padding: '50px 70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </main>
    </div>
  );
}

export default PageLayout;
