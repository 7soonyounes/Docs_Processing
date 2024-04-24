import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function Table({ results }) {
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    if (results && results.length > 0) {
      const fields = new Set();
      results.forEach(result => {
        result.ocr_results.forEach(field => {
         
          fields.add(field[0]); 
        });
      });

      const columns = Array.from(fields).map(fieldName => ({
        field: fieldName.toLowerCase().replace(/\s+/g, ''), 
        headerName: fieldName,
        editable: true,
        filter: 'agTextColumnFilter', 
        headerClass: 'my-custom-header-class', 
      }));

      setColumnDefs([
        { field: 'fileName', headerName: 'File Name', checkboxSelection: true, editable: false, filter: true, headerClass: 'my-custom-header-class' },
        ...columns
      ]);
    }
  }, [results]);  // Ensuring useEffect reacts to changes in results

  if (!results || results.length === 0) {
    return <div style={{ height: 520, width: '100%', textAlign: 'center' }}>
      No results to display
    </div>;
  }

  const rowData = results.map((result, index) => ({
    id: index,
    fileName: result.file_name,
    ...result.ocr_results.reduce((acc, field) => {
      const sanitizedKey = field[0].toLowerCase().replace(/\s+/g, '');
      acc[sanitizedKey] = field[1];
      return acc;
    }, {}),
  }));

  return (
    <div className="ag-theme-quartz" style={{ height: 350, width: '80%' }}>
      <style>
        {`
          .ag-theme-quartz .my-custom-header-class {
            background-color: white !important;
            color: #ee6110 !important;
          }
        `}
      </style>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        animateRows={true}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          resizable: true,
        }}
      />
    </div>
  );
}

export default Table;
