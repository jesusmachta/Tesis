import express, { Request, Response } from "express";
import AWS from "aws-sdk";

const app = express();
const port = process.env.PORT || 3000;

// Configurar las credenciales de AWS usando un perfil
const credentials = new AWS.SharedIniFileCredentials({ profile: "my-profile" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" }); // Cambia la región según tu configuración

// Configurar AWS Rekognition
const rekognition = new AWS.Rekognition();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Cata!");
});

app.post("/analyze-face", (req: Request, res: Response) => {
  const { image } = req.body; // Se espera que la imagen esté en base64

  // Verificar que la imagen esté en base64
  if (!image) {
    return res.status(400).send({ message: "Invalid image format" });
  }

  // Eliminar el prefijo de la imagen base64 si existe
  const base64Image = image.includes("base64,")
    ? image.split("base64,").pop()
    : image;

  const params = {
    Image: {
      Bytes: Buffer.from(base64Image, "base64"),
    },
    Attributes: ["ALL"],
  };

  rekognition.detectFaces(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
