import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from 'file-saver';
import "../styles/feature.css";

function Images() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [images, setImages] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/templates/")
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });
  }, []);

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append("images", image);
    });
    formData.append("template", selectedTemplate);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/process_image/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Received data:", response.data.results);
      setOcrResults(response.data.results);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteImage = (index) => {
    // Implement image deletion logic
  };

  const downloadCSV = () => {
    const header = ["File Name", ...ocrResults[0].ocr_results.map(res => res[0])];
    const rows = ocrResults.map(result => [result.file_name, ...result.ocr_results.map(res => res[1])]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'ocr_results.csv');
  };

  return (
    <div
      style={{
        backgroundColor: "#E5e5e5",
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
        <div style={{ fontWeight: "bold", color: "#51514f", fontSize: "17px", marginLeft: "20px" }}>
          BCP Technologies
        </div>
        <a href="/Accueil" style={{ color: "#51514f", fontWeight: "bold", marginLeft: "20px", marginRight: "20px", textDecoration: "none" }}>
          back
        </a>
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            flex: "0 0 200px",
            backgroundColor: "#E5e5e5",
            padding: "20px",
            borderRight: "1px solid #ccc",
          }}
        >
          <form onSubmit={handleSubmit}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "20px", backgroundColor: "#fff", padding: "10px", borderRadius: "5px" }}>
                <label htmlFor="image" style={{ backgroundColor: "transparent", color: "#51514f", border: "none", cursor: "pointer", display: "block", width: "100%", textAlign: "center", fontSize: "12px" }}>
                  Upload Images
                </label>
                <input type="file" id="image" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </li>
              <li style={{ marginBottom: "20px", backgroundColor: "#fff", padding: "10px", borderRadius: "5px" }}>
                <select id="template" value={selectedTemplate} onChange={handleTemplateChange} style={{ backgroundColor: "transparent", color: "#51514f", border: "none", cursor: "pointer", display: "block", width: "100%", textAlign: "center", fontSize: "12px" }}>
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </li>
              <li style={{ marginBottom: "20px", backgroundColor: "#854e56", padding: "10px", borderRadius: "5px" }}>
                <button type="submit" style={{ backgroundColor: "transparent", color: "#fff", border: "none", cursor: "pointer", display: "block", width: "100%", textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>
                  Process Images
                </button>
              </li>
              {ocrResults && ocrResults.length > 0 && (
                <li style={{ marginBottom: "20px", backgroundColor: "#854e56", padding: "10px", borderRadius: "5px" }}>
                  <button onClick={downloadCSV} style={{ backgroundColor: "transparent", color: "#fff", border: "none", cursor: "pointer", display: "block", width: "100%", textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>
                    Download CSV
                  </button>
                </li>
              )}
            </ul>
          </form>
          <div
            style={{
              // marginTop: "auto",
              backgroundColor: "#854e56",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "400px",
            }}
          >
            <a
              href="/Addtemplate"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "block",
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                textDecoration: "none",
                fontSize: "12px",
              }}
            >
              Add Template
            </a>
          </div>
        </aside>
        <main style={{ flex: 1, padding: "60px", display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
          {images.length > 0 && (
            <div style={{ textAlign: "left", color: "#51514f", marginBottom: "20px", width: "100%" }}>
              <h3>Images</h3>
              <div style={{ border: "1px solid #51514f", borderRadius: "5px", padding: "8px", maxHeight: "60px", overflowY: "auto", width: "100%", scrollbarWidth: "thin", scrollbarColor: "#51514f transparent" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {images.map((image, index) => (
                    <li key={index} style={{fontSize : "13px" ,marginBottom: "5px" }}>{image.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {ocrResults && ocrResults.length > 0 && (
            <div style={{ width: "100%" }}>
              <h1 style={{ fontWeight: "bold", color: "#854e56" }}>Results</h1>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd", color: "#51514f" }}>
                <thead style={{ backgroundColor: "#854e56", color: "#fff" }}>
                  <tr>
                    <th style={{ border: "1px solid #51514f", padding: "8px", textAlign: "left" }}>File Name</th>
                    {ocrResults[0].ocr_results.map((res, index) => (
                      <th key={index} style={{ border: "1px solid #51514f", padding: "8px", textAlign: "left" }}>{res[0]}</th>
                    ))}
                    <th style={{ border: "1px solid #51514f", padding: "8px", textAlign: "left" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {ocrResults.map((result, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #51514f", padding: "8px" }}>{result.file_name}</td>
                      {result.ocr_results.map((res, resIndex) => (
                        <td key={resIndex} style={{ border: "1px solid #51514f", padding: "8px" }}>{res[1]}</td>
                      ))}
                      <td style={{ border: "1px solid #51514f", padding: "8px", textAlign: "center" }}>
                        <button onClick={() => handleDeleteImage(index)} style={{ backgroundColor: "transparent", color: "#51514f", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Images;
