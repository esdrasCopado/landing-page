import express from 'express';
import path from 'path';
import fs from 'fs-extra';

const app = express();
const PORT = 3000;

// Middleware para procesar datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));

// Convertir la URL del archivo a ruta de sistema de archivos
const __dirname = path.resolve();


// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
  const filePath = path.resolve('form.html');
  res.sendFile(filePath);
});

// Ruta para procesar el formulario
app.post('/submit', (req, res) => {
  const {name, ease, confusion, changes, 'future-use': futureUse, time } = req.body;

  const data = {
    name,
    ease,
    confusion,
    changes,
    futureUse,
    time,
    submittedAt: new Date().toISOString(),
  };

  // Ruta donde se guardará el archivo JSON
  const filePath = path.join(__dirname, 'submissions.json');  // Asegúrate de que la ruta sea correcta

  // Imprimir la ruta para asegurarse que sea correcta
  console.log("Ruta del archivo JSON:", filePath);

  // Asegurarse de que el directorio exista, si no, crear el directorio
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // Crear directorios si no existen
  }

  // Leer datos existentes (si el archivo ya existe)
  let submissions = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    submissions = JSON.parse(fileData);
  }

  // Agregar la nueva entrada
  submissions.push(data);

  // Guardar los datos actualizados en el archivo
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

  console.log('Datos recibidos y guardados:', data);

  // Respuesta al cliente
  res.send(`
    <h1>Formulario recibido</h1>
    <p><strong>Nombre del alumno</strong><br>${name}</p>
    <p><strong>¿Qué tan fácil o difícil te pareció apartar la asesoría?</strong><br>${ease}</p>
    <p><strong>¿Qué tan fácil o difícil te pareció apartar la asesoría?</strong><br>${ease}</p>
    <p><strong>¿Hubo algo confuso o que no funcionara como esperabas?</strong><br>${confusion}</p>
    <p><strong>¿Qué cambiarías o agregarías para que la herramienta sea más útil?</strong><br>${changes}</p>
    <p><strong>Si necesitaras apartar asesorías regularmente, ¿usarías esta herramienta?</strong><br>${futureUse === 'yes' ? 'Sí' : 'No'}</p>
    <p><strong>¿Cuánto tiempo crees que te tomaría apartar una asesoría en el futuro con esta herramienta?</strong><br>${time}</p>
  `);
});

app._router.get('/GetData', function (req, res) {
    const filePath = path.join(__dirname,'submissions.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const submissions = JSON.parse(fileData);
      res.json(submissions);
    } else {
      res.json([]);
    }
  
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



