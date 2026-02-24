document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Header Glassmorphism on Scroll
       ========================================================================== */
    const header = document.getElementById('mainHeader');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    /* ==========================================================================
       Fullscreen Overlay Menu Toggle
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            menuToggleBtn.classList.add('active');
            menuToggleBtn.setAttribute('aria-expanded', 'true');
            overlayMenu.classList.add('active');
            header.classList.add('menu-open');
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            menuToggleBtn.classList.remove('active');
            menuToggleBtn.setAttribute('aria-expanded', 'false');
            overlayMenu.classList.remove('active');
            header.classList.remove('menu-open');
            // Re-enable body scroll
            document.body.style.overflow = '';
        }
    };

    menuToggleBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.fade-up-on-scroll');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       Chatbot Logic (Mock)
       ========================================================================== */
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatbotBody = document.getElementById('chatbotBody');

    const toggleChatbot = () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    };

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', `${sender}-message`);
        msgDiv.textContent = text;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    };

    const handleChatSubmit = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // Setup user message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Mock bot response
        setTimeout(() => {
            let response = "¡Gracias por escribirnos! Un asesor se pondrá en contacto contigo pronto. Si es urgente, por favor usa el botón de WhatsApp.";
            const lowerText = text.toLowerCase();

            if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('cotizar')) {
                response = "Para darte una cotización exacta, necesitamos conocer detalles como la fecha, cantidad de invitados y tipo de evento. ¿Te gustaría dejarnos tu email o teléfono?";
            } else if (lowerText.includes('hola') || lowerText.includes('buenos dias') || lowerText.includes('buenas tardes')) {
                response = "¡Hola! Qué gusto saludarte. ¿Cómo te podemos ayudar a hacer tu evento inolvidable?";
            } else if (lowerText.includes('boda') || lowerText.includes('matrimonio')) {
                response = "¡Nos encantan las bodas! Transformamos espacios para que tu día especial sea un sueño hecho realidad. Contáctanos por WhatsApp para enviarte nuestro portafolio de bodas.";
            } else if (lowerText.includes('globo') || lowerText.includes('globos')) {
                response = "¡El arte con globos es nuestra especialidad! Desde guirnaldas orgánicas hasta estructuras complejas, cuéntanos la temática de tu evento y lo diseñamos a medida.";
            }

            appendMessage(response, 'bot');
        }, 1000); // 1s delay to seem like typing
    };

    chatSend.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });

    /* ==========================================================================
       Contact Form Submission (via Local Backend & Resend)
       ========================================================================== */
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            try {
                // Send data to our local Node.js backend
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, email, servicio, mensaje }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('¡Gracias! Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto pronto.');
                    contactForm.reset();
                } else {
                    alert(`Error: ${result.error || 'Hubo un problema al enviar tu mensaje.'}`);
                }
            } catch (error) {
                console.error('Error de red:', error);
                alert('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
            } finally {
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
