import React, { useEffect } from 'react';
import Typed from 'typed.js'; 
import Login from './login';
<link href='https://unpkg.com/css.gg@2.0.0/icons/css/home.css' rel='stylesheet'></link>

function Home() {
  useEffect(() => {

    var typed = new Typed('.typed', {
      strings: ['Images ', 'PDFs ', 'AI Chatbot ...'],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, []); 


  return (
    <div style={{ backgroundColor: '#E5e5e5', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <header style={{ backgroundColor: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc' }}>
      <div class="gg-home" style={{ fontWeight: 'bold', color: '#51514f', fontSize: '17px', marginLeft: '50px' }}>BCP Technologies</div>
      <div>
        <a href="/images" style={{ color: '#091b1a', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', textDecoration: 'none' }}></a>
      </div>
    </header>
    <main style={{ flex: 1, padding: '50px 70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
      <h1 style={{ textAlign: 'left', fontSize: '3em', marginBottom: '20px' }}>
        <span style={{ fontWeight: 'bold', color: '#854e56' }}>Docs Processing</span><br />
        <span style={{ fontSize: '35px', color: '#51514f' }} className="typed"></span> {/* Use className instead of class */}
      </h1>
      <Login /> {/* Render the Login component */}
    </main>
  </div>

  );
}

export default Home;
