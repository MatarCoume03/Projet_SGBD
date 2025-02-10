import { useState } from "react";
import { toast } from "react-hot-toast";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [checksum, setChecksum] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChecksumChange = (event) => {
    setChecksum(event.target.value);
  };

  const validateChecksum = (checksum) => {
    const regex = /^[a-fA-F0-9]{64}$/; // Format SHA256
    return regex.test(checksum);
  };

  const handleUpload = async () => {
    if (!file || !checksum) {
      toast.error("Veuillez sélectionner un fichier et entrer un checksum.");
      return;
    }

    if (!validateChecksum(checksum)) {
      toast.error("Le checksum doit être un SHA256 valide.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("checksum", checksum);

    try {
      const response = await fetch("http://localhost/sgbd_project/server.js", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Fichier et empreinte soumis avec succès.");
      } else {
        toast.error(result.error || "Erreur lors de l'upload.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Importation du fichier électoral</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        value={checksum}
        onChange={handleChecksumChange}
        placeholder="SHA256..."
      />
      <br />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
};

export default FileUpload;
