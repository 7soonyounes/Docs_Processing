import React, { useState } from 'react';

function Pdf() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: question }),
    });
    const data = await response.json();
    setResults(data.results);
  };

  return (
    <div style={{ backgroundColor: "#E5e5e5", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ backgroundColor: "#fff", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
        <div style={{ fontWeight: "bold", color: "#51514f", fontSize: "17px", marginLeft: "20px" }}>
          BCP Technologies
        </div>
        <a href="/Accueil" style={{ color: "#51514f", fontWeight: "bold", marginLeft: "20px", marginRight: "20px", textDecoration: "none" }}>
          Back
        </a>
      </header>
      <main style={{ flex: 1, padding: "60px", display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
        <div style={{ width: '50%' }}> {/* This div wraps the form and centers it */}
          <h3 style={{ textAlign: 'left', color: '#51514f' }}>Search</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ padding: "10px", width: "80%", marginRight: "10px", borderRadius: "5px" }}
            />
            <button type="submit" style={{ padding: "10px", width: "15%", backgroundColor: "#51514f", color: "#fff", border: "none", borderRadius: "5px" }}>
              Send
            </button>
          </form>
          <div>
            {results.map((result, index) => (
              <div key={index} style={{ marginTop: "20px", backgroundColor: "#fff", color: "#333", padding: "10px", borderRadius: "5px" }}>
                <h4>Pdf: {result.file_name}</h4>
                <p>Paragraph: {result.paragraph}</p>
                <p>Page: {result.page}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pdf;
