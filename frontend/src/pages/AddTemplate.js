import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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
        <div>
          <a
            href="/images"
            style={{
              color: "#51514f",
              fontWeight: "bold",
              marginLeft: "20px",
              marginRight: "20px",
              textDecoration: "none",
            }}
          >
            Images
          </a>
        </div>
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
                    style={{ border: "none", outline: "none", fontSize: "12px" }}
                  />
                  <button onClick={() => handleDeleteField(index)}>
                    Delete
                  </button>
                </li>
              ))}
              <li
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#854e56",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <button
                  onClick={handleSaveFields}
                  style={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
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
