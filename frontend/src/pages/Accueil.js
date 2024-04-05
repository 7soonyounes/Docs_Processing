import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/feature.css'
import Typed from 'typed.js'; 

function Accueil() {
    useEffect(() => {

        var typed = new Typed('.typed', {
          strings: ['Welcome', 'Youness'],
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
        <div class="gg-home" style={{ fontWeight: 'bold', color: '#51514f', fontSize: '17px', marginLeft: '20px' }}>Home</div>
        <div>
            <a href="/images" style={{ color: '#091b1a', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', textDecoration: 'none' }}></a>
        </div>
    </header>
    <div style={{ justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3em', marginRight: '30px' }}>
            <span style={{ fontWeight: 'bold', color: '#854e56' }}>Our Services</span><br />
            <span style={{ fontSize: '35px', color: '#51514f' }} className="typed"></span> {/* Use className instead of class */}
        </h1>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridGap: '10px', justifyContent: 'center', alignContent: 'center', marginTop: '20px', marginLeft:'70px' }}>
        <article class="information [ card ]">
            <span class="tag">Feature</span>
            <h2 class="title">Image Processing</h2>
            <p class="info">Upload images and extract structured data using customizable templates.</p>
            <button class="button">
                <a href="/images" class="a">Get Started</a>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                </svg>
            </button>
        </article>
        <article class="information [ card ]">
            <span class="tag">Feature</span>
            <h2 class="title">PDF Information Extraction</h2>
            <p class="info">Extract specific information from PDF documents and locate them efficiently.</p>
            <button class="button">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                </svg>
            </button>
        </article>
        <article class="information [ card ]">
            <span class="tag">Feature</span>
            <h2 class="title">AI Chatbot</h2>
            <p class="info">Interact with PDF documents and get assistance from our chatbot.</p>
            <button class="button">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                </svg>
            </button>
        </article>
    </div>
</div>
    );
}
export default Accueil;