const slide = document.querySelector(".slide");
const images = document.querySelectorAll(".slide img");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let index = 0;
let startX = 0;
let endX = 0;
const totalSlides = images.length;

// Função para atualizar o slide
function showSlide() {
    slide.style.transform = `translateX(${-index * 100}vw)`;
}

// Botão "Próximo"
nextButton.addEventListener("click", () => {
    if (index < totalSlides - 1) {
        index++;
    } else {
        index = 0; // Volta para a primeira imagem
    }
    showSlide();
});

// Botão "Anterior"
prevButton.addEventListener("click", () => {
    if (index > 0) {
        index--;
    } else {
        index = totalSlides - 1; // Volta para a última imagem
    }
    showSlide();
});

// Eventos de toque para mobile (detecta swipe)
slide.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

slide.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;

    if (startX > endX + 50) {
        // Deslizou para a esquerda (próxima imagem)
        if (index < totalSlides - 1) {
            index++;
        } else {
            index = 0; // Volta para a primeira imagem
        }
    } else if (startX < endX - 50) {
        // Deslizou para a direita (imagem anterior)
        if (index > 0) {
            index--;
        } else {
            index = totalSlides - 1; // Volta para a última imagem
        }
    }
    showSlide();
});

// Auto slide a cada 3 segundos
setInterval(() => {
    if (index < totalSlides - 1) {
        index++;
    } else {
        index = 0; // Volta para a primeira imagem
    }
    showSlide();
}, 3000);
