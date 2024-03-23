import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [templateType, setTemplateType] = useState('attestation'); 
  const [ocrResults, setOcrResults] = useState([]);
  const [error, setError] = useState(null);
  const [alignedImagePath, setAlignedImagePath] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleTemplateChange = (e) => {
    setTemplateType(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('template_type', templateType);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/process_image/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Handle successful response
        console.log('OCR Results:', response.data.ocr_results);
        setOcrResults(response.data.ocr_results);
        setAlignedImagePath(response.data.processed_image_url);
        setError(null);
      }
    } catch (error) {
      setError('Error processing image. Please try again.');
      console.error('Error:', error.response ? error.response.data : error);
    }
};

  const handleUploadImage = () => {
    document.getElementById('upload-image').click();
  };

  // Placeholder function for future "Add Template" functionality
  const handleAddTemplate = () => {
    console.log('Add template functionality to be implemented');
  };
  return (
    <div style={{ backgroundColor: '#343a40', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#212529', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold' }}>DOCS Processing</div>
        <div style={{ fontWeight: 'bold' }}>BCP Internship</div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ flex: '0 0 180px', backgroundColor: '#212531', padding: '20px' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '20px', backgroundColor: '#343a40', padding: '10px', borderRadius: '5px' }}>
              <button onClick={handleUploadImage} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' }}>Upload Image</button>
              <input type="file" accept="image/*" id="upload-image" onChange={handleImageChange} style={{ display: 'none' }} />
            </li>
            <li style={{ marginBottom: '20px', backgroundColor: '#343a40', padding: '10px', borderRadius: '5px' }}>
              <select value={templateType} onChange={handleTemplateChange} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' }}>
                <option style={{ color: '#000' }} value="attestation">Attestation RIB</option>
                <option style={{ color: '#000' }} value="fiche">Fiche Exemple</option>
              </select>
            </li>
            <li style={{marginBottom: '20px', backgroundColor: '#339966', padding: '8px', borderRadius: '5px' }}>
              <button onClick={handleSubmit} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' }}>Process Image</button>
            </li>
            <li style={{marginBottom: '20px', backgroundColor: '#CC6633', padding: '8px', borderRadius: '5px' }}>
              <button onClick={handleAddTemplate} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'center' }}>Add Template</button>
              </li>
</ul>
</aside>
<main style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
{selectedImage && (
<div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
<img src={URL.createObjectURL(selectedImage)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
</div>
)}
{alignedImagePath && (
<div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
<img src={alignedImagePath} alt="Aligned" style={{ maxWidth: '100%', maxHeight: '300px' }} />
</div>
)}
{ocrResults && ocrResults.length > 0 && (
<div>
<h2 style={{ color: '#fff' }}>OCR Results</h2>
<ul>
{ocrResults.map((result, index) => (
<li key={index}>
<strong>{result[0].id}: </strong>
{result[1].map((text, i) => (
<span key={i}>{text}, </span>
))}
</li>
))}
</ul>
</div>
)}
{error && (
<div style={{ color: 'red' }}>{error}</div>
)}
</main>
</div>
</div>
);
}

export default App;