// import React, { useState, useRef, useEffect } from 'react';

// function AddTemplate() {
//     const [image, setImage] = useState(null);
//     const [fields, setFields] = useState([]);
//     const [drawing, setDrawing] = useState(false);
//     const [currentField, setCurrentField] = useState(null);
//     const canvasRef = useRef(null);
//     const scaleFactorRef = useRef(1); // Ref to store scaling factor

//     useEffect(() => {
//         if (image && canvasRef.current) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             const maxCanvasWidth = 800; // Maximum width for the canvas
//             const maxCanvasHeight = 600; // Maximum height for the canvas
//             const scaleFactor = Math.min(maxCanvasWidth / image.width, maxCanvasHeight / image.height);
//             scaleFactorRef.current = scaleFactor; // Store scaling factor in ref
//             const scaledWidth = image.width * scaleFactor;
//             const scaledHeight = image.height * scaleFactor;
//             canvas.width = scaledWidth;
//             canvas.height = scaledHeight;
//             ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

//             // Draw saved boxes
//             fields.forEach(field => {
//                 drawBox(ctx, field);
//             });
//         }
//     }, [image, fields]);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.onload = () => {
//             const img = new Image();
//             img.onload = () => {
//                 setImage(img);
//                 setFields([]); // Reset fields when a new image is uploaded
//             };
//             img.src = reader.result;
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const drawBox = (ctx, box) => {
//         const scaleFactor = scaleFactorRef.current;
//         ctx.strokeStyle = 'red';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(box.x * scaleFactor, box.y * scaleFactor, box.w * scaleFactor, box.h * scaleFactor);
//     };

//     const handleMouseDown = (e) => {
//         if (!image || !canvasRef.current) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const scaleFactor = scaleFactorRef.current;
//         const x = (e.clientX ); // Adjust for scaling
//         const y = (e.clientY ) ; // Adjust for scaling
//         setCurrentField({ x, y, w: 0, h: 0 });
//         console.log(currentField,"down")
//         setDrawing(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!drawing || !canvasRef.current || !currentField) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const scaleFactor = scaleFactorRef.current;
//         const x = (e.clientX - rect.left) / scaleFactor; // Adjust for scaling
//         const y = (e.clientY - rect.top) / scaleFactor; // Adjust for scaling
//         const width =   Math.abs( x - currentField.x);
//         const height = Math.abs(y - currentField.y);
//         setCurrentField({ ...currentField, w: width, h: height });
//         console.log(currentField,"move")
//     };

//     const handleMouseUp = () => {
//         if (!drawing || !currentField) return;

//         setDrawing(false);
//         const rect = canvasRef.current.getBoundingClientRect();
//         const scaleFactor = scaleFactorRef.current;
//         const x = currentField.x ; // Adjust for scaling
//         const y = currentField.y; // Adjust for scaling
//         setFields([...fields, { x, y, w: currentField.w, h: currentField.h }]);
//         console.log(fields,"fields")
//         setCurrentField(null);
//         console.log(currentField,"up")
//     };

//     const handleDeleteField = (index) => {
//         const updatedFields = [...fields];
//         updatedFields.splice(index, 1);
//         setFields(updatedFields);
//     };

//     const handleSaveFields = () => {
//         const formattedData = fields.map(field => [field.name, `(${field.x},${field.y},${field.w},${field.h})`]);
//         console.log(formattedData);
//         // Implement saving logic here
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleImageUpload} />
//             {image && (
//                 <canvas
//                     ref={canvasRef}
//                     // onClick={}
//                     onMouseDown={handleMouseDown}
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     style={{ border: '1px solid black' }}
//                 />
//             )}

//             {fields.map((field, index) => (
//                 <div key={index}>
//                     <div>Field Name:</div>
//                     <input
//                         type="text"
//                         placeholder="Field Name"
//                         value={field.name || ''}
//                         onChange={(e) => {
//                             const updatedFields = [...fields];
//                             updatedFields[index].name = e.target.value;
//                             setFields(updatedFields);
//                         }}
//                     />
//                     <button onClick={() => handleDeleteField(index)}>Delete</button>
//                 </div>
//             ))}

//             <button onClick={handleSaveFields}>Save Fields</button>
//         </div>
//     );
// }

// export default AddTemplate;

// import React, { useState, useRef, useEffect } from 'react';

// const AddTemplate = () => {
//   const [drawing, setDrawing] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
//   const [endPos, setEndPos] = useState({ x: 0, y: 0 });
//   const canvasRef = useRef(null);
//   const [image, setImage] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [currentField, setCurrentField] = useState(null);
//   const scaleFactorRef = useRef(1);

//   useEffect(() => {
//     if (image && canvasRef.current) {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const maxCanvasWidth = 800; // Maximum width for the canvas
//     const maxCanvasHeight = 600; // Maximum height for the canvas
//     const scaleFactor = Math.min(maxCanvasWidth / image.width, maxCanvasHeight / image.height);
//     scaleFactorRef.current = scaleFactor; // Store scaling factor in ref
//     const scaledWidth = image.width * scaleFactor;
//             const scaledHeight = image.height * scaleFactor;
//             canvas.width = scaledWidth;
//             canvas.height = scaledHeight;
//             ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

//     const drawRectangle = () => {

//                 ctx.strokeStyle = 'red';
//                 ctx.lineWidth = 2;
//       const width = endPos.x - startPos.x;
//       const height = endPos.y - startPos.y;
//       ctx.strokeRect(startPos.x, startPos.y, width, height);
//     };

//     if (drawing) {
//       drawRectangle();
//     }
// }
//   }, [drawing, startPos, endPos,image, fields]);

//   const handleMouseDown = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setStartPos({ x, y });
//     setEndPos({ x, y });
//     setDrawing(true);
//     setCurrentField({ x, y, w: 0, h: 0 });
//   };

//   const handleMouseMove = (e) => {
//     if (drawing) {
//       const canvas = canvasRef.current;
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       setEndPos({ x, y });
//       const width =   Math.abs( x - currentField.x);
//         const height = Math.abs(y - currentField.y);
//         setCurrentField({ ...currentField, w: width, h: height });
//     }
//   };

//   const handleMouseUp = () => {
//     if (!drawing || !currentField) return;
//     setDrawing(false);
//             setFields([...fields, { x:currentField.x, y:currentField.y, w: currentField.w, h: currentField.h }]);
//         setCurrentField(null);
//   };

//       const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.onload = () => {
//             const img = new Image();
//             img.onload = () => {
//                 setImage(img);
//                 setFields([]); // Reset fields when a new image is uploaded
//             };
//             img.src = reader.result;
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//         const handleDeleteField = (index) => {
//         const updatedFields = [...fields];
//         updatedFields.splice(index, 1);
//         setFields(updatedFields);
//     };

//     const handleSaveFields = () => {
//         const formattedData = fields.map(field => [field.name, `(${field.x},${field.y},${field.w},${field.h})`]);
//         console.log(formattedData);
//         // Implement saving logic here
//     };

//   return (
//     <div>
//             <input type="file" onChange={handleImageUpload} />
//             {image && (
//                   <canvas
//                   ref={canvasRef}
//                   width={800}
//                   height={600}
//                   onMouseDown={handleMouseDown}
//                   onMouseMove={handleMouseMove}
//                   onMouseUp={handleMouseUp}
//                   style={{ border: '1px solid black'}}
//                 />
//             )}

//             {fields.map((field, index) => (
//                 <div key={index}>
//                     <div>Field Name:</div>
//                     <input
//                         type="text"
//                         placeholder="Field Name"
//                         value={field.name || ''}
//                         onChange={(e) => {
//                             const updatedFields = [...fields];
//                             updatedFields[index].name = e.target.value;
//                             setFields(updatedFields);
//                         }}
//                     />
//                     <button onClick={() => handleDeleteField(index)}>Delete</button>
//                 </div>
//             ))}

//             <button onClick={handleSaveFields}>Save Fields</button>
//         </div>
//   );
// };

// export default AddTemplate;

// This keep track of one rect
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
    ctx.strokeStyle = "red";
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
    } catch (error) {
      console.error("Error occurred while saving data:", error);
    }
  };

  return (
    <div style={{ backgroundColor: '#E5e5e5', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #51514f' }}>
        <div style={{ fontWeight: 'bold', color: '#51514f', fontSize: '17px', marginLeft: '50px' }}>Images</div>
        <div>
          <a href="/images" style={{ color: '#091b1a', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', textDecoration: 'none' }}>Images</a>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ flex: '0 0 200px', backgroundColor: '#E5e5e5', padding: '20px', borderRight: '1px solid #51514f' }}>
          <form>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
                <label htmlFor="image" style={{ backgroundColor: 'transparent', color: '#51514f', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' }}>Upload Image</label>
                <input type="file" id="image" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </li>
              <li style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
                <input type="text" placeholder="Template Name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
              </li>
              {fields.map((field, index) => (
                <li key={index} style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
                  <input type="text" placeholder="Field Name" value={field.name || ''} onChange={(e) => {
                    const updatedFields = [...fields];
                    updatedFields[index].name = e.target.value;
                    setFields(updatedFields);
                  }} />
                  <button onClick={() => handleDeleteField(index)}>Delete</button>
                </li>
              ))}
              <li style={{ marginBottom: '20px', backgroundColor: '#854e56', padding: '10px', borderRadius: '5px' }}>
                <button onClick={handleSaveFields} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center', fontWeight: 'bold' }}>Save Fields</button>
              </li>
            </ul>
          </form>
        </aside>
        <main style={{ flex: 1, padding: '70px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
