const images = [
    '/Portfolio/images/projects/namastream/namastream-1.jpg',
    '/Portfolio/images/projects/namastream/namastream-2.jpg',
    '/Portfolio/images/projects/namastream/namastream-3.jpg'
];

let currentImageIndex = 0;

function updateImageViewer() {
    const viewerImage = document.getElementById('viewerImage');
    if (viewerImage) {
        viewerImage.src = images[currentImageIndex];
    }

    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentImageIndex);
    });
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImageViewer();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImageViewer();
}

function goToImage(index) {
    currentImageIndex = index;
    updateImageViewer();
}

document.addEventListener('DOMContentLoaded', () => {
    updateImageViewer();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});

