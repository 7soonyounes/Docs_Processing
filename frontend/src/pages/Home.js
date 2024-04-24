import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Login from "./login";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

function Home() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const background = document.getElementById('background');
    if (!vantaRef.current) {
      vantaRef.current = NET({
        el: background,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xffffff,
        backgroundColor: 0x51514f,
        points: 6.00,
        maxDistance: 19.00,
        spacing: 17.00
      });
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const typed = new Typed(".typed", {
      strings: ["Images ", "PDFs ", "AI Chatbot ..."],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <div
        id="background"
        style={{
          backgroundColor: "#fff",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <header
          style={{
            textAlign: "left",
            fontSize: "1em",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#fff",
            marginTop: "20px",
            marginLeft: "50px",
          }}
        >
          <div
            className="gg-home"
            style={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: "17px",
              marginLeft: "20px",
            }}
          >
            BCP Technologies
          </div>
        </header>
        <main
          style={{
            flex: 1,
            padding: "40px 70px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <h1
            style={{
              textAlign: "left",
              fontSize: "3em",
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Docs Processing <br />
            <span
              style={{ fontSize: "35px", color: "rgb(255 106 0)" }}
              className="typed"
            ></span>
          </h1>
          <Login />
        </main>
      </div>
    </div>
  );
}

export default Home;
