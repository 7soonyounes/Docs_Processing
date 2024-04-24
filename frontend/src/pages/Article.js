import React from 'react';

function Article({ title, info, link }) {
    return (
        <article className="information" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: '6px', 
            padding: '1rem', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
            transition: 'transform 0.5s ease-in-out', 
            margin: '50px'
        }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <span className="tag" style={{ alignSelf: 'center', backgroundColor: '#e6e3e2', color: '#ee6110', fontWeight: 600, fontSize: '0.875rem', padding: '0.5em 0.75em', borderRadius: '6px' }}>Feature</span>
            <h2 className="title" style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>{title}</h2>
            <p className="info" style={{ fontSize: '1rem', color: '#333', marginTop: '0.5rem' }}>{info}</p>
            <a href={link} className="button" style={{ marginTop: '1rem', textDecoration: 'none', color: '#51514f', backgroundColor: '#fff', border: '2px solid #51514f', padding: '0.5em 1em', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Get Started
            </a>
        </article>
    );
}
export default Article;