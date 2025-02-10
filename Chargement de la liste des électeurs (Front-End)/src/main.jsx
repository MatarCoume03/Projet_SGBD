//import React from "react";
import ReactDOM from "react-dom/client";
import FileUpload from "./FileUpload"; // Assurez-vous que le chemin est correct

const App = () => {
  return (
    <div>
      <FileUpload />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
