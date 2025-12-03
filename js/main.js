document.addEventListener('DOMContentLoaded', async () => {

    // =========================================================
    // 1. CONFIGURACIÓN GENERAL Y UTILIDADES
    // =========================================================

    // Función auxiliar para obtener ruta de miniaturas
    function getPDFThumbnailPath(pdfPath) {
        const filename = pdfPath.split('/').pop(); 
        const filenameWithoutExt = filename.replace('.pdf', ''); 
        return `assets/thumbnails/${filenameWithoutExt}.png`;
    }

    // Toggle Modo Oscuro / Claro
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            if (typeof updateCharts === 'function') updateCharts(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        }
    }

    // Navbar Sticky & Smooth Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if(targetElement) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
        });
    });

    // Cerrar menú móvil al hacer click
    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarToggle && navbarCollapse && window.innerWidth < 992) {
                navbarToggle.click();
            }
        });
    });

    // =========================================================
    // 2. HERO VIDEO LOOP
    // =========================================================
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        let videos = ['assets/videos/hero1.mp4', 'assets/videos/hero2.mp4'];
        let currentVideoIndex = 0;
        
        function playNextVideo() {
            if (videos.length === 0) return;
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            heroVideo.classList.add('fade-out');
            setTimeout(() => {
                heroVideo.src = videos[currentVideoIndex];
                heroVideo.play().catch(e => console.log('Error play:', e));
                heroVideo.classList.remove('fade-out');
            }, 500);
        }
        
        heroVideo.addEventListener('ended', playNextVideo);
        // Intentar reproducir el primero
        heroVideo.play().catch(e => console.log('Autoplay prevented:', e));
    }

    // =========================================================
    // 3. DATOS (DATA)
    // =========================================================
    
    const certificateData = {
        linkedin: [
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python esencial.pdf', title: 'Python Esencial' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Domina Python.pdf', title: 'Domina Python' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python avanzado.pdf', title: 'Python Avanzado' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python avanzado 2.pdf', title: 'Python Avanzado 2' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python Errores comunes y como solucionarlos.pdf', title: 'Python: Errores Comunes' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_HTML esencial.pdf', title: 'HTML Esencial' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Fundamentos del desarrollo web Full Stack o Frontend.pdf', title: 'Fundamentos del Desarrollo Web' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Aprende diseno de base de datos relacionales.pdf', title: 'Diseño de Bases de Datos' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Fundamentos de la programacion Bases de datos.pdf', title: 'Fundamentos: Bases de Datos' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_MySQL esencial.pdf', title: 'MySQL Esencial' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Empodera a tu equipo con la inteligencia artificial.pdf', title: 'Empodera a tu Equipo con IA' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Conviertete en especialista de servicio al cliente.pdf', title: 'Especialista de Servicio al Cliente' }
        ]
    };

    const reviewsData = [
        {
            text: "Desde tu llegada visualizaste cómo funciona una compañía con una fuerte dinámica de cambio. Eres un verdadero analista, siempre tomando opinión basada en datos. <strong class='text-primary'>Mi estrategia para este semestre fue liberar todo tu potencial y disponer de tus conocimientos en pro del territorio, trabajo que has hecho de manera contundente.</strong>",
            title: "Evaluación Anual de Desempeño",
            subtitle: "End-Year 2022",
            link: "assets/performance_reviews/Performance_2022_endyear.pdf"
        },
        {
            text: "Te felicito por tu profundo analisis y aporte de información al equipo. Gracias <strong class='text-primary'>a tu agudo sentido crítico, tu agilidad cuando se te solicita alguna tarea e ir más allá de lo que se te pide, te has convertido en una pieza fundamental.</strong>",
            title: "Evaluación de Desempeño",
            subtitle: "Mid-Year 2023",
            link: "assets/performance_reviews/Performance_2023_midyear.pdf"
        },
        {
            text: "Tienes la capacidad de poder identificar desviaciones o problemas que pueden llegar a ser imperceptibles para algunos, lo que demuestra <strong class='text-primary'>tu entendimiento y deseo de querer ir más al detalle para alcanzar buenos resultados.</strong>",
            title: "Evaluación Anual de Desempeño",
            subtitle: "End-Year 2023",
            link: "assets/performance_reviews/Performance_2023_endyear.pdf"
        },
        {
            text: "Has logrado consolidar el modelo de funcionamiento del equipo, siendo <strong class='text-primary'>un referente técnico para ellos y un líder consistente</strong> que ha facilitado la implementación exitosa de las herramientas de trabajo. A la vez que has demostrado un <strong class='text-primary'>espíritu de mejora continua y crecimiento.</strong>",
            title: "Evaluación de Desempeño",
            subtitle: "Mid-Year 2024",
            link: "assets/performance_reviews/Performance_2024_midyear.pdf"
        },
        {
            text: "Este año has sido el responsable de concretar gran parte de las expectativas de desarrollo y evolución del equipo... pasar de la debilidad de los protocolos a ser hoy precisamente una fortaleza de tu equipo. <strong class='text-primary'>No hubiera sido posible llevar este desafío con tal nivel de orden, estrategia y autonomía con ninguna otra persona del equipo</strong>.",
            title: "Evaluación Anual de Desempeño",
            subtitle: "End-Year 2024",
            link: "assets/performance_reviews/Performance_2024_endyear.pdf"
        },
        {
            text: "Eres un <strong class='text-primary'>ejemplo sostenido de perseverancia, intencionalidad y mentalidad de crecimiento.</strong> Has trabajado con disciplina para desarrollar tu seniority y fortalecer tu liderazgo. Este compromiso personal se traduce en una <strong class='text-primary'>cultura de mejora continua que has sabido irradiar al equipo.</strong>",
            title: "Evaluación de Desempeño",
            subtitle: "Mid-Year 2025",
            link: "assets/performance_reviews/Performance_2025_midyear.pdf"
        }
    ];

    // =========================================================
    // 4. INFINITE SLIDERS (TESTIMONIOS & LINKEDIN)
    // =========================================================

    // A. Renderizar REVIEWS (Testimonios)
    const reviewsTrack = document.getElementById('reviewsTrack');
    if (reviewsTrack) {
        const createReviewCard = (review) => `
            <div class="review-card">
                <div class="card h-100 shadow-sm border-0 hover-card p-4">
                    <div class="card-body d-flex flex-column">
                        <blockquote class="fs-6 text-body mb-4 flex-grow-1" style="font-style: italic;">
                            "${review.text}"
                        </blockquote>
                        <div class="mt-auto border-top pt-3">
                            <a href="${review.link}" target="_blank" class="text-decoration-none d-block">
                                <div class="fw-bold text-primary mb-1">${review.title}</div>
                                <div class="text-body-secondary small"><i class="bi bi-calendar-event"></i> ${review.subtitle}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const reviewsHTML = reviewsData.map(r => createReviewCard(r)).join('');
        // Duplicar contenido para efecto infinito
        reviewsTrack.innerHTML = reviewsHTML + reviewsHTML;
    }

    // B. Renderizar LINKEDIN (Certificados)
    const linkedinTrack = document.getElementById('linkedinTrack');
    if (linkedinTrack && certificateData.linkedin) {
        const createCertCard = (cert) => {
            const thumbnailPath = getPDFThumbnailPath(cert.path);
            return `
            <div class="cert-slide-item">
                <a href="${cert.path}" target="_blank" class="certificate-link text-decoration-none">
                    <div class="certificate-thumbnail mb-3">
                        <img src="${thumbnailPath}" alt="${cert.title}" loading="lazy">
                    </div>
                    <p class="certificate-title text-center small fw-semibold px-2">${cert.title}</p>
                </a>
            </div>
            `;
        };

        const certsHTML = certificateData.linkedin.map(c => createCertCard(c)).join('');
        // Duplicar contenido para efecto infinito
        linkedinTrack.innerHTML = certsHTML + certsHTML;
    }

    // C. Renderizar STACK (Carrusel 3D)
    function setup3DCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-3d-item');
        const numItems = items.length;
        if (numItems === 0) return;

        const angle = 360 / numItems;
        // El radio (translateZ) depende del número de elementos y su ancho
        // Esta es una fórmula aproximada, se puede ajustar
        const radius = Math.round((items[0].offsetWidth / 2) / Math.tan(Math.PI / numItems));

        items.forEach((item, i) => {
            const rotation = i * angle;
            item.style.transform = `rotateY(${rotation}deg) translateZ(${radius}px)`;
        });
    }

    // Inicializar ambos carruseles
    setup3DCarousel('analysisCarousel');
    setup3DCarousel('developmentCarousel');

    // =========================================================
    // 5. CHART.JS LOGIC
    // =========================================================
    const impactCanvas = document.getElementById('impactChart');
    const automationCanvas = document.getElementById('automationChart');
    
    if (impactCanvas && automationCanvas) {
        const impactCtx = impactCanvas.getContext('2d');
        const automationCtx = automationCanvas.getContext('2d');

        const impactChartData = {
            labels: ['2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11'],
            datasets: [{
                label: 'Órdenes Gestionadas',
                data: [1700, 2500, 2400, 2300, 2900, 2800, 2100, 1500, 1600, 1500, 1300, 1600, 1700, 3700, 4500, 5200, 9100, 6500, 10200, 15200],
                backgroundColor: '#0d6efd',
                borderColor: '#0056b3',
                borderWidth: 1,
                borderRadius: 4
            }]
        };

        const automationChartData = {
            labels: ['2025-08', '2025-09', '2025-10', '2025-11'],
            datasets: [
                { label: 'Gestión Manual', data: [4700, 3000, 2800, 2700], backgroundColor: '#6c757d' },
                { label: 'Gestión Automática (AI3)', data: [4400, 3500, 7400, 12500], backgroundColor: '#dc3545' }
            ]
        };

        const getChartOptions = (theme) => {
            const isDark = theme === 'dark';
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const ticksColor = '#000000';
            const legendColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

            return {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: ticksColor }, grid: { color: gridColor } },
                    x: { ticks: { color: ticksColor }, grid: { display: false } }
                },
                plugins: {
                    legend: { labels: { color: legendColor, font: { family: 'Inter', size: 14 } } },
                    tooltip: { enabled: true, backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                }
            };
        };

        let impactChart, automationChart;

        window.updateCharts = function(theme) {
            if (impactChart) impactChart.destroy();
            if (automationChart) automationChart.destroy();

            impactChart = new Chart(impactCtx, {
                type: 'bar',
                data: impactChartData,
                options: getChartOptions(theme)
            });

            automationChart = new Chart(automationCtx, {
                type: 'bar',
                data: automationChartData,
                options: {
                    ...getChartOptions(theme),
                    scales: {
                        ...getChartOptions(theme).scales,
                        x: { ...getChartOptions(theme).scales.x, stacked: true },
                        y: { ...getChartOptions(theme).scales.y, stacked: true },
                    }
                }
            });
        };

        // Inicializar gráficos
        updateCharts(savedTheme);

        // Lógica de botones para cambiar gráfico
        const showImpactBtn = document.getElementById('showImpactChart');
        const showAutomationBtn = document.getElementById('showAutomationChart');

        if(showImpactBtn && showAutomationBtn) {
            showImpactBtn.addEventListener('click', () => {
                impactCanvas.classList.remove('d-none');
                automationCanvas.classList.add('d-none');
                showImpactBtn.classList.add('active-chart-btn');
                showImpactBtn.classList.remove('inactive-chart-btn');
                showAutomationBtn.classList.add('inactive-chart-btn');
                showAutomationBtn.classList.remove('active-chart-btn');
            });

            showAutomationBtn.addEventListener('click', () => {
                impactCanvas.classList.add('d-none');
                automationCanvas.classList.remove('d-none');
                showAutomationBtn.classList.add('active-chart-btn');
                showAutomationBtn.classList.remove('inactive-chart-btn');
                showImpactBtn.classList.add('inactive-chart-btn');
                showImpactBtn.classList.remove('active-chart-btn');
            });
        }
    }
});