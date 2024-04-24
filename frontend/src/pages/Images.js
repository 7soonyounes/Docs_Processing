import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "../styles/feature.css";
import Table from "./table";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

function Images() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [images, setImages] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [isProcessHovered, setIsProcessHovered] = useState(false);
  const [isAddTemplateHovered, setIsAddTemplateHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const vantaRef = useRef(null);
  useEffect(() => {
    const background = document.getElementById("background");

    if (!vantaRef.current) {
      vantaRef.current = NET({
        el: background,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xffffff,
        backgroundColor: 0x51514f,
        points: 6.0,
        maxDistance: 19.0,
        spacing: 17.0,
      });
    }

    axios
      .get("http://127.0.0.1:8000/api/templates/")
      .then((response) => setTemplates(response.data))
      .catch((error) => console.error("Error fetching templates:", error));

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  const handleTemplateChange = (e) => setSelectedTemplate(e.target.value);

  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image, index) => formData.append("images", image));
    formData.append("template", selectedTemplate);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/process_image/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Received data:", response.data.results);
      setOcrResults(response.data.results);
      console.log("Received data:", response.data.results);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const downloadCSV = () => {
    const header = [
      "File Name",
      ...ocrResults[0].ocr_results.map((res) => res[0]),
    ];
    const rows = ocrResults.map((result) => [
      result.file_name,
      ...result.ocr_results.map((res) => res[1]),
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "ocr_results.csv");
  };

  const buttonStyle = (hover) => ({
    backgroundColor: hover ? "#f26413" : "white",
    color: hover ? "white" : "#51514f",
    border: `1px solid ${hover ? "#f26413" : "#ccc"}`,
    cursor: "pointer",
    display: "block",
    width: "100%",
    padding: "10px",
    textAlign: "center",
    fontWeight: "normal",
    fontSize: "12px",
    borderRadius: "5px",
    textDecoration: "none",
  });

  return (
    <div
      style={{
        backgroundColor: "#51514f",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: "#51514f",
            fontSize: "17px",
            marginLeft: "20px",
          }}
        >
          BCP Technologies
        </div>
        <a
          href="/Accueil"
          style={{
            color: "#51514f",
            fontWeight: "bold",
            marginLeft: "20px",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Back
        </a>
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside
          id="background"
          style={{
            flex: "0 0 200px",
            // backgroundColor: "#51514f",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "2px solid #fff !important",
          }}
        >
          <form onSubmit={handleSubmit}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "20px" }}>
                <label htmlFor="image" style={buttonStyle(false)}>
                  Upload Images
                </label>
                <input
                  type="file"
                  id="image"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </li>
              <li style={{ marginBottom: "20px" }}>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  style={buttonStyle(false)}
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </li>
              <li style={{ marginBottom: "20px" }}>
                <button
                  style={buttonStyle(isProcessHovered)}
                  onMouseEnter={() => setIsProcessHovered(true)}
                  onMouseLeave={() => setIsProcessHovered(false)}
                >
                  Process Images
                </button>
              </li>
              {ocrResults.length > 0 && (
                <li style={{ marginBottom: "20px" }}>
                  <button
                    style={buttonStyle(isDownloadHovered)}
                    onMouseEnter={() => setIsDownloadHovered(true)}
                    onMouseLeave={() => setIsDownloadHovered(false)}
                    onClick={downloadCSV}
                  >
                    Download CSV
                  </button>
                </li>
              )}
            </ul>
          </form>
          <div>
            <a
              href="/Addtemplate"
              style={buttonStyle(isAddTemplateHovered)}
              onMouseEnter={() => setIsAddTemplateHovered(true)}
              onMouseLeave={() => setIsAddTemplateHovered(false)}
            >
              Add Template
            </a>
          </div>
        </aside>
        <main
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            marginLeft: "70px",
          }}
        >
          {images.length > 0 && (
            <div
              style={{
                textAlign: "left",
                color: "#fff",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              <h3>Images</h3>
              <div
                style={{
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  padding: "8px",
                  maxHeight: "60px",
                  overflowY: "auto",
                  width: "80%",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#fff transparent",
                }}
              >
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {images.map((image, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "13px",
                        marginBottom: "5px",
                        color: "#fff",
                      }}
                    >
                      {image.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {ocrResults.length > 0 && (
            <div style={{ width: "100%" }}>
              <h3 style={{ fontWeight: "bold", color: "#fff" }}>Results</h3>
              <Table results={ocrResults} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Images;
