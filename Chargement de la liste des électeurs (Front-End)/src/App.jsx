import { useState } from "react";
import { Button } from "./components/ui/button"; // Si tu utilises des composants personnalisés
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
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
    // Vérification du format SHA256
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
      const response = await fetch("http://localhost:5173/upload", {
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
      console.error(error); // Affichage de l'erreur dans la console
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Importation du fichier électoral</h2>
        <Label className="block mb-2">Sélectionnez un fichier CSV :</Label>
        <Input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
        <Label className="block mb-2">Saisissez empreinte CHECKSUM (SHA256) :</Label>
        <Input type="text" value={checksum} onChange={handleChecksumChange} className="mb-4" />
        <Button onClick={handleUpload} className="w-full">Uploader</Button>
      </div>
    </div>
  );
};

export default FileUpload;
