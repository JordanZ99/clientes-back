// 1. Importaciones (Traer las herramientas que vamos a usar)
require('dotenv').config(); // ➡️ 💡 Esto carga las variables de entorno del archivo .env
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

// 2. Configuración de la Base de Datos (Pool de conexiones)
const PORT = process.env.PORT || 3000;
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación inicial de conexión
pool.getConnection()
    .then(conn => {
        console.log("✅ CONEXIÓN EXITOSA: ¡El backend está listo para trabajar!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ ERROR FATAL: No se pudo conectar a la base de datos.");
        console.error(err);
    });


// 3. Middleware (Preparar Express)
app.use(cors()); // ➡️ 💡 Habilita CORS para que el frontend pueda conectarse
app.use(express.json());


// 4. El Endpoint (El "Camino" del API)
app.get('/clientes', async (req, res) => {
    console.log('\n🔗 Se recibió una petición en /clientes. ¡Vamos a consultar la BD!');

    // 🔑 La consulta SQL: pidiéndole todos los clientes.
    const sql = 'SELECT * FROM clientes';

    try {
        // Ejecutar la consulta de forma asíncrona y segura
        const [rows] = await pool.execute(sql);

        // Si todo salió bien (Status 200 = OK)
        res.status(200).json({
            message: '✅ Listado de clientes obtenido con éxito.',
            data: rows // Devolvemos los resultados de la BD
        });

    } catch (error) {
        // Si algo sale mal (ej. la tabla no existe o la BD se cayó)
        console.error("❌ ERROR EN LA CONSULTA: ", error);
        // Devolvemos un error 500 para que el frontend sepa que falló.
        res.status(500).json({
            error: 'Error interno del servidor al consultar la base de datos.',
            details: error.message
        });
    }
});


// 5. Poner el servidor a escuchar (El arranque)
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 API Backend está corriendo en http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
