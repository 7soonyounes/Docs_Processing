import React, { useEffect } from 'react';
import '../styles/feature.css';
import Typed from 'typed.js';
import Article from './Article'; 

function Accueil() {
    useEffect(() => {
        var typed = new Typed('.typed', {
            strings: ['Get', 'Started'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#51514f', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ textAlign: "left", fontSize: "1em", marginBottom: "20px", fontWeight: "bold", color: "#fff", marginTop: "20px", marginLeft: "50px" }}>
                <div className="gg-home" style={{ fontWeight: "bold", color: "#fff", fontSize: "17px", marginLeft: "20px" }}>
                    Home
                </div>
            </header>
            <div style={{ justifyContent: 'center' }}>
                <h1 style={{ textAlign: 'center', fontSize: '3em', marginRight: '30px' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>Our Services</span><br />
                    <span style={{ fontSize: '35px', color: '#ee6110' }} className="typed"></span>
                </h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', justifyContent: 'center', alignContent: 'center', marginTop: '20px'}}>
                <Article title="Image Processing" info="Upload images and extract structured data using customizable templates." link="/images" />
                <Article title="PDF Infos Extraction" info="Extract specific information from PDF documents and locate them efficiently." link="/pdf" />
                <Article title="AI Chatbot" info="Interact with PDF documents and get assistance from our chatbot." link="/chatbot" />
            </div>
        </div>
    );
}

export default Accueil;
