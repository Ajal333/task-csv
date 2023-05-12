import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append("file", file);

    const response = await axios.post("http://localhost:8080/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("response", response);
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <div>{file && `${file.name} - ${file.type}`}</div>

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

export default App;
