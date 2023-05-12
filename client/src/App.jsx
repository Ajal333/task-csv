import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [data, setData] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      return;
    }

    if (file.type !== "text/csv") {
      return alert("Upload CSV file");
    }

    const data = new FormData();
    data.append("file", file);

    const response = await axios.post("http://localhost:8080/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.data) {
      setData(response?.data);
    }
  };
  return (
    <section className="main">
      <input type="file" onChange={handleFileChange} />
      <div className="fileDetails">
        <p>{file && `Uploaded file: ${file.name}`}</p>
        <p>{file && `File Type: ${file.type}`}</p>
      </div>
      <button onClick={handleUploadClick}>Upload</button>
      {data && (
        <div className="result">
          <p>
            Sheet Link:{" "}
            <a href={data?.sheet} target="__blank">
              {data?.sheet}
            </a>
          </p>
          <p>
            Chart Link:{" "}
            <a href={data?.chart} target="__blank">
              {data?.chart}
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

export default App;
