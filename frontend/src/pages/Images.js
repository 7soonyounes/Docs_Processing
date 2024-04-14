import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/feature.css";

function Images() {
  const [images, setImages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
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

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image, index) => {
        formData.append("images", image);  // Make sure this matches with what your backend expects
    });
    formData.append("template", selectedTemplate);

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/process_image/",
            formData,
            { headers: { "Content-Type": "multipart/form-data" }}
        );
        console.log("Received data:", response.data.results);  // Log the received data
        setOcrResults(response.data.results);
    } catch (error) {
        console.error("Error:", error);
    }
};

  return (
    <div style={{ backgroundColor: "#E5e5e5", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ backgroundColor: "#fff", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
        <div style={{ fontWeight: "bold", color: "#51514f", fontSize: "17px", marginLeft: "20px" }}>
          BCP Technologies
        </div>
        <a href="/Accueil" style={{ color: "#51514f", fontWeight: "bold", marginLeft: "20px", marginRight: "20px", textDecoration: "none" }}>
          back
        </a>
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{ flex: "0 0 200px", backgroundColor: "#E5e5e5", padding: "20px", borderRight: "1px solid #ccc" }}>
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
              <li
                style={{
                  marginTop: "350px",
                  marginBottom: "20px",
                  backgroundColor: "#854e56",
                  padding: "10px",
                  borderRadius: "5px",
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
              </li>
            </ul>
          </form>
        </aside>
        <main style={{ flex: 1, padding: "70px", display: "flex", alignItems: "center", flexDirection: "column" }}>
          {images.length > 0 && images.map((image, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  borderRadius: "0px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              </div>
            </div>
          ))}
          {ocrResults && ocrResults.length > 0 && (
            <div style={{ marginLeft: "150px", marginTop: "20px", width: "100%" }}>
              <h1 style={{ fontWeight: "bold", color: "#854e56" }}>OCR Results:</h1>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>File Name</th>
                    {ocrResults[0].ocr_results.map((res, index) => (
                      <th key={index} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>{res[0]}</th>  // Displaying location names as headers
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ocrResults.map((result, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.file_name}</td>
                      {result.ocr_results.map((res, resIndex) => (
                        <td key={resIndex} style={{ border: "1px solid #ddd", padding: "8px" }}>{res[1]}</td>  // Displaying OCR text corresponding to each location
                      ))}
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

