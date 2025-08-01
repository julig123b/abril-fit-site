// Funciones de interacción para el sitio de Abril Fit

document.addEventListener('DOMContentLoaded', function () {
  // Navegación responsiva
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Animación reveal al hacer scroll
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Carrusel para fotos antes/después
  const slider = document.querySelector('.slider');
  if (slider) {
    const slidesContainer = slider.querySelector('.slides');
    const slides = slider.querySelectorAll('.slide');
    const btnPrev = slider.querySelector('.slide-btn.prev');
    const btnNext = slider.querySelector('.slide-btn.next');
    let currentIndex = 0;

    function updateSlider() {
      slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    btnNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    btnPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });
  }

  // Preguntas frecuentes (FAQ) toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });

  // Formulario de contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Reset formulario
      contactForm.reset();
      const messageEl = contactForm.querySelector('.form-message');
      messageEl.textContent = '¡Gracias! Pronto me pondré en contacto contigo.';
      setTimeout(() => {
        messageEl.textContent = '';
      }, 5000);
    });
  }

  // Animación de números en la sección de estadísticas
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const isPercent = el.textContent.trim().endsWith('%');
          let current = 0;
          const steps = 60; // número de frames para la animación
          const increment = target / steps;
          function count() {
            current += increment;
            if (current >= target) {
              el.textContent = target + (isPercent ? '%' : '');
            } else {
              el.textContent = Math.floor(current) + (isPercent ? '%' : '');
              requestAnimationFrame(count);
            }
          }
          count();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    statNumbers.forEach(el => statObserver.observe(el));
  }

  // Test interactivo de objetivos
  const testWrapper = document.querySelector('.test-steps');
  if (testWrapper) {
    const steps = testWrapper.querySelectorAll('.test-step');
    const resultStep = testWrapper.querySelector('.test-result');
    const resultText = resultStep.querySelector('.result-text');
    let answers = {};

    function showStep(stepNumber) {
      steps.forEach(step => {
        if (parseInt(step.getAttribute('data-step'), 10) === stepNumber) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
      if (stepNumber === 3) {
        resultStep.style.display = 'block';
      } else {
        resultStep.style.display = 'none';
      }
    }

    function computeRecommendation() {
      const goal = answers.goal;
      const days = answers.days;
      let recommendation = '';
      if (goal === 'perder') {
        if (days === '1-2') {
          recommendation = 'Clases de funcional';
        } else if (days === '3-4') {
          recommendation = 'Rutinas personalizadas';
        } else {
          recommendation = 'Asesoría 1:1';
        }
      } else if (goal === 'ganar') {
        recommendation = 'Asesoría 1:1';
      } else if (goal === 'mejorar') {
        if (days === '5+') {
          recommendation = 'Rutinas personalizadas';
        } else {
          recommendation = 'Clases de funcional';
        }
      } else {
        recommendation = 'Rutinas personalizadas';
      }
      return recommendation;
    }

    // Manejar clics en opciones
    testWrapper.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.test-options button')) {
        const stepElement = e.target.closest('.test-step');
        const stepNumber = parseInt(stepElement.getAttribute('data-step'), 10);
        const value = e.target.getAttribute('data-value');
        if (stepNumber === 1) {
          answers.goal = value;
          showStep(2);
        } else if (stepNumber === 2) {
          answers.days = value;
          // calcular y mostrar resultado
          const recommendation = computeRecommendation();
          resultText.textContent = recommendation;
          showStep(3);
        }
      }
    });
  }

  /*
   * Carrusel reducido en el héroe
   * En esta versión el carrusel se muestra en un contenedor pequeño en el lado derecho
   * del hero. Las imágenes se deslizan horizontalmente y el usuario puede
   * navegar con los botones de anterior y siguiente. No se cambia automáticamente.
   */
  const galleryTrack = document.querySelector('.hero-gallery .carousel-track');
  const galleryImages = document.querySelectorAll('.hero-gallery .gallery-image');
  const galleryPrev = document.querySelector('.hero-gallery .gallery-prev');
  const galleryNext = document.querySelector('.hero-gallery .gallery-next');
  let galleryIndex = 0;

  function showGallerySlide(idx) {
    if (!galleryImages.length) return;
    // calcular el ancho de una imagen incluyendo margen derecho
    const style = window.getComputedStyle(galleryImages[0]);
    const marginRight = parseFloat(style.marginRight);
    const slideWidth = galleryImages[0].offsetWidth + marginRight;
    galleryTrack.style.transform = `translateX(-${idx * slideWidth}px)`;
  }

  if (galleryImages.length && galleryPrev && galleryNext) {
    galleryPrev.addEventListener('click', () => {
      galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
      showGallerySlide(galleryIndex);
    });
    galleryNext.addEventListener('click', () => {
      galleryIndex = (galleryIndex + 1) % galleryImages.length;
      showGallerySlide(galleryIndex);
    });
    // Ajustar tamaño inicial
    window.addEventListener('resize', () => showGallerySlide(galleryIndex));
    showGallerySlide(galleryIndex);
  }
});