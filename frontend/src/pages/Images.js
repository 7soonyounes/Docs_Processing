import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/feature.css";

function Images() {
  const [image, setImage] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [ocrResults, setOcrResults] = useState(null);

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
    setImage(e.target.files[0]);
  };

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("template", selectedTemplate);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/process_image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      setOcrResults(response.data.ocr_results);
    } catch (error) {
      console.error("Error:", error);
    }
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
          borderBottom: "2px solid #ccc",
        }}
      >
        <div
          class="gg-home"
          style={{
            fontWeight: "bold",
            color: "#51514f",
            fontSize: "17px",
            marginLeft: "20px",
          }}
        >
          BCP Technologies
        </div>
        <div>
          <a
            href="/Accueil"
            style={{
              color: "#51514f",
              fontWeight: "bold",
              marginLeft: "20px",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >back</a>
        </div>
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            flex: "0 0 200px",
            backgroundColor: "#E5e5e5",
            padding: "20px",
            borderRight: "1px solid #51514f",
          }}
        >
          <form onSubmit={handleSubmit}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <label
                  htmlFor="image"
                  style={{
                    backgroundColor: "transparent",
                    color: "#51514f",
                    border: "none",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </li>
              <li
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  style={{
                    backgroundColor: "transparent",
                    color: "#51514f",
                    border: "none",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </li>
              <li
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#854e56",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <button
                  type="submit"
                  style={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Process Image
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
                  }}
                >
                  Add Template
                </a>
              </li>
            </ul>
          </form>
        </aside>
        <main
          style={{
            flex: 1,
            padding: "70px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {image && (
            <div style={{ display: "flex", alignItems: "center" }}>
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
              {ocrResults && (
                <div style={{ marginLeft: "150px" }}>
                  <h1 style={{ fontWeight: "bold", color: "#854e56" }}>
                    Results :
                  </h1>
                  {ocrResults.map((result, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          fontWeight: "bold",
                          marginRight: "10px",
                          fontSize: "18px",
                        }}
                      >
                        {result[0]}:
                      </span>
                      <span style={{ fontSize: "18px" }}>{result[1]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Images;
