document.addEventListener('DOMContentLoaded', () => {

    const contentWrapper = document.querySelector('.content-wrapper');

    // On-load text animation trigger
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 200);

    // --- MARQUEE LOGIC ---
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const content = Array.from(marqueeTrack.children);
        content.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    // --- SPOTLIGHT PROJECTS CAROUSEL LOGIC ---
    const projectsCarousel = document.querySelector('.projects-carousel-container');
    if (projectsCarousel) {
        const track = projectsCarousel.querySelector('.projects-carousel-track');
        const slides = Array.from(track.children);
        const nextButton = projectsCarousel.querySelector('.carousel-button.next');
        const prevButton = projectsCarousel.querySelector('.carousel-button.prev');
        
        let currentIndex = 0;
        const slideCount = slides.length;

        const updateCarousel = () => {
            slides.forEach((slide, index) => {
                const offset = index - currentIndex;
                
                // Base transform values
                let translateX = offset * 60; // Percentage offset for side slides
                let scale = 0.8;
                let rotateY = offset > 0 ? -15 : 15;
                let zIndex = slideCount - Math.abs(offset);

                if (offset === 0) { // The active slide
                    slide.classList.add('is-active');
                    translateX = 0;
                    scale = 1;
                    rotateY = 0;
                } else {
                    slide.classList.remove('is-active');
                }

                // Don't apply 3D rotation on smaller screens for a cleaner look
                const transformValue = window.innerWidth <= 768 ?
                    `translateX(${translateX}%) scale(${scale})` :
                    `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`;
                
                slide.style.transform = transformValue;
                slide.style.zIndex = zIndex;
            });
        };

        const moveToIndex = (index) => {
            currentIndex = (index + slideCount) % slideCount; // Wrap around
            updateCarousel();
        };

        nextButton.addEventListener('click', () => moveToIndex(currentIndex + 1));
        prevButton.addEventListener('click', () => moveToIndex(currentIndex - 1));

        // Drag/Swipe functionality
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;

        const getPositionX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        
        const dragStart = e => {
            isDragging = true;
            startPos = getPositionX(e);
            projectsCarousel.style.cursor = 'grabbing';
        };

        const dragEnd = e => {
            if (!isDragging) return;
            isDragging = false;
            const movedBy = getPositionX(e) - startPos;

            // If drag is significant, change slide
            if (movedBy < -100 && currentIndex < slideCount - 1) {
                moveToIndex(currentIndex + 1);
            } else if (movedBy > 100 && currentIndex > 0) {
                moveToIndex(currentIndex - 1);
            }
            projectsCarousel.style.cursor = 'grab';
        };

        projectsCarousel.addEventListener('mousedown', dragStart);
        projectsCarousel.addEventListener('touchstart', dragStart, { passive: true });
        
        projectsCarousel.addEventListener('mouseup', dragEnd);
        projectsCarousel.addEventListener('mouseleave', dragEnd);
        projectsCarousel.addEventListener('touchend', dragEnd);
        
        // Prevent default drag behavior on images
        track.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', (e) => e.preventDefault()));
        
        // Initial setup
        updateCarousel();
    }
});