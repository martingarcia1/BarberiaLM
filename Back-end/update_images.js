require('dotenv').config({ path: '.env' });
const { sequelize } = require('./src/config/database');

const updateImages = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a la BD.');

        // 1. Asegurar que la columna imagen_url existe en servicio
        // (Si da error, es que ya existe o no se puede añadir, continuamos)
        try {
            await sequelize.query("ALTER TABLE servicio ADD COLUMN imagen_url VARCHAR(255) DEFAULT NULL;");
            console.log("Columna imagen_url agregada a servicio.");
        } catch (e) {
            console.log("Columna imagen_url ya existe o error al crearla (ignorable):", e.message);
        }

        // 2. Mapeo de Servicios -> Imágenes
        const serviciosMap = {
            'Media Americano': '/img/media-americana.jpeg',
            'Made Fade': '/img/made-fade.jpeg',
            'Made Fade en V': '/img/made-fade-en-v.jpeg',
            'Low Fade': '/img/low-fade.jpeg',
            'Mullet': '/img/mullet.jpeg',
            'High Fade': '/img/high-fade.jpeg',
            'Buzz Cut': '/img/buzz-cut.jpeg',
            'Nacional B': '/img/nacional-b.jpeg',
            'Corte de Barba': '/img/corte-de-barba.jpeg',
            'Teñido + Corte': '/img/teñido-corte.jpeg',
            'Corte + lavado': '/img/corte-lavado.jpeg',
            'Combo Completo': '/img/combo.jpeg'
        };

        for (const [nombre, img] of Object.entries(serviciosMap)) {
            await sequelize.query(
                "UPDATE servicio SET imagen_url = :img WHERE nombre_servicio = :nombre",
                { replacements: { img, nombre } }
            );
            console.log(`Actualizado servicio: ${nombre}`);
        }

        // 3. Mapeo de Productos -> Imágenes (usamos genéricas o específicas si hay coincidencia)
        // Basado en los nombres del SQL dump
        const productosMap = {
            'Gel Fijador': '/img/imagen1.jpeg', // Asumiendo uno
            'Shampoo': '/img/imagen2.jpeg',
            'Cera para el Cabello': '/img/imagen3.jpeg'
        };

        for (const [nombre, img] of Object.entries(productosMap)) {
            await sequelize.query(
                "UPDATE producto SET imagen_url = :img WHERE nombre_producto = :nombre",
                { replacements: { img, nombre } }
            );
            console.log(`Actualizado producto: ${nombre}`);
        }

        console.log('Actualización de imágenes completada.');

    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

updateImages();
