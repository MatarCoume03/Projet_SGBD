import { useState } from "react";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material"; // Importation des composants de MUI
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
    // Vérification du format SHA256 (64 caractères hexadécimaux)
    const regex = /^[a-fA-F0-9]{64}$/;
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
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Fichier et empreinte soumis avec succès.");
        setFile(null);
        setChecksum("");
      } else {
        toast.error(result.error || "Erreur lors de l'upload.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
      <Card style={{ width: 400, padding: 20, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 10 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Importation du fichier électoral
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: 15, width: "100%" }}
          />
          <TextField
            type="text"
            value={checksum}
            onChange={handleChecksumChange}
            fullWidth
            margin="normal"
            label="Saisissez empreinte CHECKSUM (SHA256)"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            fullWidth
            style={{ marginTop: 16 }}
          >
            Uploader
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
