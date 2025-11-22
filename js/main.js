/* PDF.js Configuration */
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

document.addEventListener('DOMContentLoaded', async () => {

    // ===== DARK MODE TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Cargar tema guardado o usar default (light)
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateCharts(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        }
    }

    // ===== DATA DE CERTIFICADOS (Ordenados lógicamente) =====
    const certificateData = {
        degree: [
            { path: 'assets/degree_certificates/Certificado de Titulo Tecnico Nivel Superior.pdf', title: 'Título Técnico Nivel Superior' },
            { path: 'assets/degree_certificates/Certificado de Titulo.pdf', title: 'Título Profesional' },
            { path: 'assets/degree_certificates/Diplomado de Gestion de Proyectos.pdf', title: 'Diplomado en Gestión de Proyectos' }
        ],
        linkedin: [
            // Python (especialización)
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python esencial.pdf', title: 'Python Esencial' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Domina Python.pdf', title: 'Domina Python' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python avanzado.pdf', title: 'Python Avanzado' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python avanzado 2.pdf', title: 'Python Avanzado 2' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Python Errores comunes y como solucionarlos.pdf', title: 'Python: Errores Comunes' },
            // Desarrollo Web
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_HTML esencial.pdf', title: 'HTML Esencial' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Fundamentos del desarrollo web Full Stack o Frontend.pdf', title: 'Fundamentos del Desarrollo Web' },
            // Bases de Datos
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Aprende diseno de base de datos relacionales.pdf', title: 'Diseño de Bases de Datos' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Fundamentos de la programacion Bases de datos.pdf', title: 'Fundamentos: Bases de Datos' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_MySQL esencial.pdf', title: 'MySQL Esencial' },
            // Habilidades
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Empodera a tu equipo con la inteligencia artificial.pdf', title: 'Empodera a tu Equipo con IA' },
            { path: 'assets/linkedin_certificates/CertificadoDeFinalizacion_Conviertete en especialista de servicio al cliente.pdf', title: 'Especialista de Servicio al Cliente' }
        ]
    };

    // ===== BOOTSTRAP CAROUSEL LINKEDIN =====
    const carouselInner = document.getElementById('linkedinCarouselInner');
    const itemsPerSlide = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    
    // Dividir certificados en grupos de 3
    for (let i = 0; i < certificateData.linkedin.length; i += itemsPerSlide) {
        const slide = document.createElement('div');
        slide.className = i === 0 ? 'carousel-item active' : 'carousel-item';
        
        const row = document.createElement('div');
        row.className = 'row g-3';
        
        // Añadir hasta 3 certificados en cada slide
        for (let j = 0; j < itemsPerSlide && i + j < certificateData.linkedin.length; j++) {
            const cert = certificateData.linkedin[i + j];
            const colSize = itemsPerSlide === 1 ? 12 : itemsPerSlide === 2 ? 6 : 4;
            
            const col = document.createElement('div');
            col.className = `col-${colSize}`;
            col.innerHTML = `
                <a href="${cert.path}" target="_blank" class="certificate-link text-decoration-none">
                    <div class="certificate-thumbnail" data-pdf="${cert.path}">
                        <div class="certificate-placeholder">
                            <i class="bi bi-file-pdf"></i>
                            <p>PDF</p>
                        </div>
                    </div>
                    <p class="certificate-title text-center mt-2">${cert.title}</p>
                </a>
            `;
            
            row.appendChild(col);
        }
        
        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }

    // ===== GENERAR MINIATURAS PDF =====
    async function generatePDFThumbnail(pdfPath, containerElement) {
        try {
            const encodedPdfPath = encodeURI(pdfPath);
            // Fetch del PDF
            const pdf = await pdfjsLib.getDocument(encodedPdfPath).promise;
            const page = await pdf.getPage(1);
            
            // Calcular viewport
            const viewport = page.getViewport({ scale: 1.0 });
            
            // Crear canvas
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.maxWidth = '100%';
            canvas.style.height = 'auto';
            
            const context = canvas.getContext('2d');
            
            // Renderizar página
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // Reemplazar placeholder con canvas
            containerElement.innerHTML = '';
            containerElement.appendChild(canvas);
            containerElement.style.padding = '4px';
            containerElement.style.backgroundColor = '#ffffff';
            
        } catch (error) {
            console.debug(`PDF preview no disponible para: ${pdfPath}`);
            // Mantener el placeholder visual que ya está en el HTML
        }
    }

    // ===== GRÁFICOS CHART.JS =====
    const impactCtx = document.getElementById('impactChart')?.getContext('2d');
    const automationCtx = document.getElementById('automationChart')?.getContext('2d');
    
    if (impactCtx && automationCtx) {
        const impactChartData = {
            labels: ['2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11'],
            datasets: [{
                label: 'Órdenes Gestionadas',
                data: [1700, 2500, 2400, 2300, 2900, 2800, 2100, 1500, 1600, 1500, 1300, 1600, 1700, 3700, 4500, 5200, 9100, 6500, 10200, 9700],
                backgroundColor: '#0d6efd',
                borderColor: '#0056b3',
                borderWidth: 1,
                borderRadius: 4
            }]
        };

        const automationChartData = {
            labels: ['2025-08', '2025-09', '2025-10', '2025-11'],
            datasets: [
                {
                    label: 'Gestión Manual',
                    data: [6000, 3000, 2800, 1700],
                    backgroundColor: '#6c757d',
                },
                {
                    label: 'Gestión Automática (AI3)',
                    data: [3100, 3500, 7400, 8000],
                    backgroundColor: '#dc3545',
                }
            ]
        };

        const getChartOptions = (theme) => {
            const isDark = theme === 'dark';
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const ticksColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            const legendColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

            return {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: ticksColor,
                            font: { family: 'Inter' }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: {
                            color: ticksColor,
                            font: { family: 'Inter' }
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: legendColor,
                            font: { family: 'Inter', size: 14 }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { family: 'Inter', size: 16 },
                        bodyFont: { family: 'Inter', size: 14 },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('es-CL').format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            };
        };

        let impactChart, automationChart;

        function updateCharts(theme) {
            if (impactChart) {
                impactChart.destroy();
            }
            if (automationChart) {
                automationChart.destroy();
            }

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
        }

        updateCharts(savedTheme);

        // Cambiar entre gráficos
        const showImpactBtn = document.getElementById('showImpactChart');
        const showAutomationBtn = document.getElementById('showAutomationChart');
        const impactCanvas = document.getElementById('impactChart');
        const automationCanvas = document.getElementById('automationChart');

        showImpactBtn?.addEventListener('click', () => {
            impactCanvas.classList.remove('d-none');
            automationCanvas.classList.add('d-none');
            showImpactBtn.classList.add('active-chart-btn');
            showImpactBtn.classList.remove('inactive-chart-btn');
            showAutomationBtn.classList.add('inactive-chart-btn');
            showAutomationBtn.classList.remove('active-chart-btn');
        });

        showAutomationBtn?.addEventListener('click', () => {
            impactCanvas.classList.add('d-none');
            automationCanvas.classList.remove('d-none');
            showAutomationBtn.classList.add('active-chart-btn');
            showAutomationBtn.classList.remove('inactive-chart-btn');
            showImpactBtn.classList.add('inactive-chart-btn');
            showImpactBtn.classList.remove('active-chart-btn');
        });
    }

    // ===== SMOOTH SCROLL PARA NAVBAR =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if(targetElement) {
                    const navbar = document.getElementById('navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // ===== INICIAR GENERACIÓN DE MINIATURAS PARA TODOS LOS PDFs =====
    document.querySelectorAll('.certificate-thumbnail').forEach(thumb => {
        const pdfPath = thumb.getAttribute('data-pdf');
        if (pdfPath) {
            generatePDFThumbnail(pdfPath, thumb);
        }
    });

    // ===== CERRAR NAVBAR AL HACER CLIC =====
    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarToggle && navbarCollapse) {
                navbarToggle.click();
            }
        });
    });

});