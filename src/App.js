import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Streamgraph from "./components/Streamgraph";
import Legend from "./components/Legend";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  return (
    <div className="App">
      <FileUpload set_data={setData} />

      {data && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Streamgraph data={data} />
          <Legend />
        </div>
      )}
    </div>
  );
}

export default App;
