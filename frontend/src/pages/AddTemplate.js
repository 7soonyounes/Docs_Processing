import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const AddTemplate = () => {
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [temp, setTemp] = useState(null);
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState(null);
  const scaleFactorRef = useRef(1);
  const [deleteRec, setDeleteRec] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for showing success message
  const [isSaveFieldsHovered, setSaveFieldsHovered] = useState(false);

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

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const maxCanvasWidth = 800;
      const maxCanvasHeight = 600;
      const scaleFactor = Math.min(
        maxCanvasWidth / image.width,
        maxCanvasHeight / image.height
      );
      scaleFactorRef.current = scaleFactor;
      const scaledWidth = image.width * scaleFactor;
      const scaledHeight = image.height * scaleFactor;
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    }
  }, [image]);

  useEffect(() => {
    if (drawing || deleteRec) {
      // console.log("drawing");
      drawRectangle();
    }
  }, [drawing, endPos, fields, deleteRec]);

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#77F857";
    ctx.lineWidth = 2;

    fields.forEach((field) => {
      ctx.strokeRect(field.x, field.y, field.w, field.h);
    });

    if (drawing) {
      const scaleFactor = scaleFactorRef.current;
      const startX = startPos.x * scaleFactor;
      const startY = startPos.y * scaleFactor;
      const endX = endPos.x * scaleFactor;
      const endY = endPos.y * scaleFactor;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      ctx.strokeRect(startX, startY, width, height);
    }
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


  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = scaleFactorRef.current;
    const x = (e.clientX - rect.left) / scaleFactor;
    const y = (e.clientY - rect.top) / scaleFactor;
    setStartPos({ x, y });
    setEndPos({ x, y });
    setDrawing(true);
    setCurrentField({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleFactor = scaleFactorRef.current;
      const x = (e.clientX - rect.left) / scaleFactor;
      const y = (e.clientY - rect.top) / scaleFactor;

      setEndPos({ x, y });

      const width = Math.abs(x - startPos.x);
      const height = Math.abs(y - startPos.y);

      setCurrentField({ ...currentField, w: width, h: height });
    }
  };

  const handleMouseUp = () => {
    if (!drawing || !currentField) return;
    setDrawing(false);
    setFields([
      ...fields,
      {
        x: currentField.x,
        y: currentField.y,
        w: currentField.w,
        h: currentField.h,
      },
    ]);
    setCurrentField(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setTemp(file);

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setFields([]);
      };
      img.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
    setDeleteRec(true);
  };

  const handleSaveFields = async () => {
    const formattedData = fields.map((field) => ({
      name: field.name,
      x: field.x,
      y: field.y,
      width: field.w,
      height: field.h,
    }));

    const formData = new FormData();
    formData.append("name", templateName);
    formData.append("templateImage", temp);
    formData.append("OCRLocations", JSON.stringify(formattedData));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/save-template/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data saved successfully:", response.data);
      setShowSuccessMessage(true); // Show success message
    } catch (error) {
      console.error("Error occurred while saving data:", error);
    }
  };

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
          <form>
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
                    fontSize: "12px",
                  }}
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </li>
              <li
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <input
                  type="text"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  style={{ border: "none", outline: "none", fontSize: "12px" }}
                />
              </li>
              {fields.map((field, index) => (
                <li
                key={index}
                style={{
                  display: 'flex', // This will align items in a row
                  alignItems: 'center', // This will vertically center align items
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <input
                  type="text"
                  placeholder="Field Name"
                  value={field.name || ""}
                  onChange={(e) => {
                    const updatedFields = [...fields];
                    updatedFields[index].name = e.target.value;
                    setFields(updatedFields);
                  }}
                  style={{ 
                    border: "none", 
                    outline: "none", 
                    fontSize: "12px",
                    flexGrow: 1, // Allows the input to fill space
                    marginRight: '10px' // Adds some spacing between the input and the button
                  }}
                />
                <button 
                  onClick={() => handleDeleteField(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#f26413', // X icon color
                    fontWeight: 'bold',
                    fontSize: '16px', // Makes the X larger
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Delete field"
                >
                  &#x2715; {/* Unicode character for X */}
                </button>
              </li>
              
              ))}
              <li
                style={{ marginBottom: "20px" }}
              >
                <button
                  onClick={handleSaveFields}
                  style={buttonStyle(isSaveFieldsHovered)}
                  onMouseEnter={() => setSaveFieldsHovered(true)}
                  onMouseLeave={() => setSaveFieldsHovered(false)}
                >
                  Save Fields
                </button>
              </li>
              {showSuccessMessage && (
                <li
                  style={{
                    marginBottom: "20px",
                    backgroundColor: "#77F857",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "#fff",
                  }}
                >
                  saved successfully
                </li>
              )}
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
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ border: "1px solid black" }}
            />
          )}
        </main>
      </div>
    </div>
  );
};
export default AddTemplate;
