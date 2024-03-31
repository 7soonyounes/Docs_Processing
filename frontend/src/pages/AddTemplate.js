import React, { useState, useRef, useEffect } from 'react';

function AddTemplate() {
    const [image, setImage] = useState(null);
    const [fields, setFields] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [fieldName, setFieldName] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas is not null

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Ensure context is not null

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the uploaded image
            if (image) {
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = image;
            }

            // Draw boxes for each field
            fields.forEach(field => {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(field.x, field.y, field.w, field.h);
            });

            // Draw current field (if drawing)
            if (currentField && drawing) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(currentField.x, currentField.y, currentField.w, currentField.h);
            }
        };

        draw();
    }, [fields, currentField, drawing, image]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
            setImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e) => {
        if (!image) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDrawing(true);
        setCurrentField({ x, y, w: 0, h: 0 });
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newField = { ...currentField, w: x - currentField.x, h: y - currentField.y };
        setCurrentField(newField);
    };

    const handleMouseUp = () => {
        if (!image) return;

        setDrawing(false);
        setFields([...fields, currentField]);
        setCurrentField(null);
    };

    const handleFieldNameChange = (index, newName) => {
        const updatedFields = [...fields];
        updatedFields[index].name = newName;
        setFields(updatedFields);
    };

    const handleAddField = () => {
        setFieldName('');
        setCurrentField(null);
    };

    const handleSaveFields = () => {
        // Implement saving logic here
    };

    const printResult = () => {
        const resultCanvas = document.createElement('canvas');
        const resultCtx = resultCanvas.getContext('2d');
        resultCanvas.width = canvasRef.current.width;
        resultCanvas.height = canvasRef.current.height;

        // Draw the image
        const img = new Image();
        img.onload = () => {
            resultCtx.drawImage(img, 0, 0);
            
            // Draw boxes for each field
            fields.forEach(field => {
                resultCtx.strokeStyle = 'red';
                resultCtx.lineWidth = 2;
                resultCtx.strokeRect(field.x, field.y, field.w, field.h);
            });

            // Open the result in a new window
            const win = window.open('', '_blank');
            win.document.body.appendChild(resultCanvas);
        };
        
        img.src = image;
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {image && (
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ border: '1px solid black' }}
                />
            )}

            <div>
                <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="Field Name" />
                <button onClick={handleAddField}>Add Field</button>
            </div>

            {fields.map((field, index) => (
                <div key={index}>
                    <div>Field Name:</div>
                    <input type="text" value={field.name} onChange={(e) => handleFieldNameChange(index, e.target.value)} />
                </div>
            ))}

            <button onClick={handleSaveFields}>Save Fields</button>
            <button onClick={printResult}>Print Result</button>
        </div>
    );
}

export default AddTemplate;
