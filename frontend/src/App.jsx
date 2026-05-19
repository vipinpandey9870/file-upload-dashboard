import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
    setProducts([]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select an Excel file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const response = await axios.post("https://file-upload-dashboard.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProducts(response.data || []);
      setStatus(`Uploaded ${file.name} successfully.`);
    } catch (error) {
      console.error(error);
      setProducts([]);
      setStatus(
        error.response?.data?.error || "Failed to upload and parse the file."
      );
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>Upload Excel File</h1>
          <p>Choose an XLSX file and see the extracted product data displayed in a clean table.</p>
        </div>

        <div className="upload-row">
          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
          <button className="button" type="button" onClick={handleUpload}>
            Upload
          </button>
        </div>

        {status && (
          <p className={`status ${status.toLowerCase().includes("failed") || status.toLowerCase().includes("no file") ? "error" : ""}`}>
            {status}
          </p>
        )}

        {products.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Buy Amount</th>
                  <th>Sell Amount</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Product ?? item.product ?? ""}</td>
                    <td>{item["Buy Amount"] ?? item.buyAmount ?? ""}</td>
                    <td>{item["Sell Amount"] ?? item.sellAmount ?? ""}</td>
                    <td>{item.Profit ?? item.profit ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No data to display yet. Upload an Excel file to preview the products list.</p>
        )}
      </div>
    </div>
  );
}

export default App;