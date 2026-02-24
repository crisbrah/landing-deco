const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // 1. Configuracion de CORS (importante para evitar bloqueos del navegador web)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 2. Responder rápidamente al "Preflight" request de OPTIONS (seguridad de los navegadores)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Validar que solo se permitan pedidos POST (es decir, envio de datos)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
    }

    // 4. Recepción y validación de los datos del formulario de la landing page
    const { nombre, email, servicio, mensaje } = req.body;

    if (!nombre || !email || !servicio || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // 5. Envío del Correo usando el API de Resend
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // Remitente (temporal de prueba que ofrece Resend)
            to: 'crisbrah@gmail.com',      // Destinatario: el correo directo que solicitaste
            subject: `Nueva Cotización de ${nombre} - Shaddai Deco & Event`,
            html: `
                <h2>Nueva Solicitud de Cotización</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Correo Electrónico (Contacto):</strong> ${email}</p>
                <p><strong>Servicio de Interés:</strong> ${servicio.toUpperCase()}</p>
                <p><strong>Mensaje:</strong></p>
                <blockquote style="font-style: italic; border-left: 3px solid #ccc; padding-left: 10px;">${mensaje}</blockquote>
                <hr>
                <p><small>Este mensaje fue enviado desde el formulario de contacto de tu Landing Page.</small></p>
            `,
        });

        // Respuesta exitosa al script.js frontend
        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Error enviando con Resend:', error);
        res.status(500).json({ error: 'Hubo un error al comunicarse con el proveedor de correos (Resend).' });
    }
};
