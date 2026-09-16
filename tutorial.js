/**
 * Eco Heróis — Tutorial Controller
 * Controla a navegação interativa pelas abas e vídeos explicativos dos 5 níveis.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const toggleBtn = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    if (toggleBtn && navList) {
        toggleBtn.addEventListener('click', () => {
            navList.classList.toggle('is-open');
        });
    }

    const steps = [
        {
            num: 1,
            title: 'Missão 1: Parque da Cidade',
            desc: 'Arrasta ou toca nos resíduos de <strong>papel, plástico e vidro</strong> para os colocares nos respetivos ecopontos oficiais antes que o tempo esgote!',
            video: 'videos/nivel1.mp4',
            url: 'nivel1.html'
        },
        {
            num: 2,
            title: 'Missão 2: Quarto Tecnológico',
            desc: 'Separa as <strong>pilhas gastas para o Pilhão</strong> e entrega os <strong>computadores, telemóveis e auscultadores avariados</strong> na Caixa de Eletrónicos!',
            video: 'videos/nivel2.mp4',
            url: 'nivel2.html'
        },
        {
            num: 3,
            title: 'Missão 3: Jardim Sustentável',
            desc: 'Transforma restos de fruta, vegetais e cascas de ovo em adubo orgânico! Coloca todos os resíduos biodegradáveis dentro da <strong>composteira</strong>.',
            video: 'videos/nivel3.mp4',
            url: 'nivel3.html'
        },
        {
            num: 4,
            title: 'Missão 4: Poupança de Água',
            desc: 'Combate o desperdício na casa de banho! Quando uma torneira começar a correr água, <strong>clica ou toca imediatamente para a fechar</strong>.',
            video: 'videos/nivel4.mp4',
            url: 'nivel4.html'
        },
        {
            num: 5,
            title: 'Missão 5: Eficiência Energética',
            desc: 'Apaga todas as <strong>lâmpadas acesas desnecessariamente</strong> na sala. Poupas eletricidade e reduzes a pegada de carbono!',
            video: 'videos/nivel5.mp4',
            url: 'nivel5.html'
        }
    ];

    let currentStep = 1;

    const tabs = document.querySelectorAll('.tutorial-tab');
    const titleElem = document.getElementById('tutorial-step-title');
    const descElem = document.getElementById('tutorial-step-desc');
    const videoElem = document.getElementById('tutorial-video');
    const btnPlayLevel = document.getElementById('btn-jogar-nivel');
    const btnPrev = document.getElementById('btn-prev-tut');
    const btnNext = document.getElementById('btn-next-tut');

    function renderStep(stepNum) {
        currentStep = stepNum;
        const step = steps[stepNum - 1];

        // Atualizar abas
        tabs.forEach(tab => {
            const tabStep = parseInt(tab.dataset.step, 10);
            tab.classList.toggle('active', tabStep === stepNum);
        });

        // Atualizar textos e links
        if (titleElem) titleElem.textContent = step.title;
        if (descElem) descElem.innerHTML = step.desc;
        if (btnPlayLevel) {
            btnPlayLevel.href = step.url;
            btnPlayLevel.textContent = `Jogar Nível ${step.num} ➔`;
        }

        // Atualizar vídeo
        if (videoElem) {
            videoElem.pause();
            videoElem.src = step.video;
            videoElem.load();
            videoElem.play().catch(() => {});
        }

        // Visibilidade dos botões
        if (btnPrev) btnPrev.style.visibility = stepNum > 1 ? 'visible' : 'hidden';
        if (btnNext) {
            if (stepNum < 5) {
                btnNext.style.visibility = 'visible';
                btnNext.textContent = 'Próxima Missão ▶';
            } else {
                btnNext.style.visibility = 'visible';
                btnNext.textContent = 'Ir para o Jogo ➔';
            }
        }
    }

    // Ouvintes de clique nas abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const step = parseInt(tab.dataset.step, 10);
            renderStep(step);
        });
    });

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentStep > 1) renderStep(currentStep - 1);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentStep < 5) {
                renderStep(currentStep + 1);
            } else {
                window.location.href = 'nivel1.html';
            }
        });
    }

    renderStep(1);
});