/**
 * Eco Heróis — Aprende a Reciclar Controller
 * Gere o mostruário de ecopontos, a ferramenta de pesquisa de resíduos e o simulador de compostagem.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile responsivo
    const toggleBtn = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');
    if (toggleBtn && navList) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navList.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navList.contains(e.target) && !toggleBtn.contains(e.target)) {
                navList.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 1. Dados dos Ecopontos
    const binData = {
        azul: {
            title: 'Ecoponto Azul: Papel e Cartão',
            color: 'var(--bin-papel)',
            simbolo: '🔵',
            aceita: 'Caixas de cereais, caixas de cartão espalmadas, jornais, revistas, folhas de papel, sacos de papel e cadernos sem espiral.',
            evita: 'Papel plastificado, papel com gordura (guardanapos usados, toalhas de papel sujas, caixas de pizza com queijo) e fraldas.'
        },
        amarelo: {
            title: 'Ecoponto Amarelo: Plástico e Metal',
            color: 'var(--bin-plastico)',
            simbolo: '🟡',
            aceita: 'Garrafas de água e refrigerante, pacotes de leite e sumo (tetrapak), latas de conserva e refrigerante, sacos de plástico, frascos de champô e embalagens de detergente.',
            evita: 'Talheres de plástico descartáveis, brinquedos de plástico que não sejam embalagem, canetas e cabides.'
        },
        verde: {
            title: 'Ecoponto Verde: Vidro',
            color: 'var(--bin-vidro)',
            simbolo: '🟢',
            aceita: 'Garrafas de azeite, vinho e água, frascos de compota, boiões de comida de bebé e frascos de perfume vazios.',
            evita: 'Espelhos, vidros de janelas, pratos, travessas de pirex, lâmpadas e loiças de cerâmica.'
        },
        pilhas: {
            title: 'Pilhão: Pilhas e Baterias',
            color: 'var(--bin-pilhas)',
            simbolo: '🔴',
            aceita: 'Pilhas alcalinas normais (AA, AAA, 9V), pilhas de relógio (tipo botão) e baterias recarregáveis de telemóveis e portáteis.',
            evita: 'Lixo indiferenciado e baterias de automóvel (estas devem ser entregues em oficinas autorizadas).'
        },
        bio: {
            title: 'Composteira: Matéria Orgânica',
            color: 'var(--bin-bio)',
            simbolo: '🟤',
            aceita: 'Cascas de fruta e legumes, borras de café, saquetas de chá (sem agrafo), cascas de ovo esmagadas, folhas secas e aparas de relva.',
            evita: 'Restos de carne ou peixe, lacticínios, ossos e fezes de animais de estimação.'
        }
    };

    const binCards = document.querySelectorAll('.bin-option-card');
    const binDetailContent = document.getElementById('bin-detail-content');

    binCards.forEach(card => {
        card.addEventListener('click', () => {
            binCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const binKey = card.dataset.bin;
            const data = binData[binKey];

            if (data && binDetailContent) {
                binDetailContent.innerHTML = `
                    <h3 style="color: ${data.color}; margin-bottom: 0.4rem;">${data.simbolo} ${data.title}</h3>
                    <p style="margin-bottom: 0.5rem;">
                        <strong>O que deitar:</strong> ${data.aceita}
                    </p>
                    <p style="margin: 0; font-size: 0.95rem; color: var(--eco-danger);">
                        ⚠️ <em>Não deitar:</em> ${data.evita}
                    </p>
                `;
            }
        });
    });

    // 2. Pesquisa de Resíduos (Onde Deitar o Quê)
    const wasteDatabase = [
        { termo: 'garrafa de plastico', nome: 'Garrafa de Plástico (Água / Refrigerante)', bin: 'Amarelo', motivo: 'Esvazia e espalma a garrafa para poupar espaço!' },
        { termo: 'lata', nome: 'Lata de Bebida ou Conserva', bin: 'Amarelo', motivo: 'O alumínio e o aço podem ser 100% reciclados infinitas vezes.' },
        { termo: 'leite', nome: 'Pacote de Leite / Sumo (Tetrapak)', bin: 'Amarelo', motivo: 'Embalagens de cartão complexo para líquidos vão para o ecoponto amarelo.' },
        { termo: 'caixa de papelao', nome: 'Caixa de Cartão', bin: 'Azul', motivo: 'Espalma a caixa para caber facilmente no contentor azul.' },
        { termo: 'jornal', nome: 'Jornal ou Revista', bin: 'Azul', motivo: 'O papel limpo deve ser reciclado no ecoponto azul.' },
        { termo: 'pizza', nome: 'Caixa de Pizza com Gordura', bin: 'Lixo Comum (Indiferenciado)', motivo: 'O papel engordurado não pode ser reciclado! Só a tampa limpa pode ir para o azul.' },
        { termo: 'azeite', nome: 'Garrafa de Vidro de Azeite', bin: 'Verde', motivo: 'Basta escorrer bem o azeite antes de colocar no ecoponto verde.' },
        { termo: 'frasco', nome: 'Frasco de Compota ou Conserva', bin: 'Verde', motivo: 'Coloca o frasco de vidro no verde e a tampa de metal no amarelo.' },
        { termo: 'pilha', nome: 'Pilha ou Bateria', bin: 'Pilhão (Vermelho)', motivo: 'Contém mercúrio e cádmio perigosos. Deves levar ao pilhão de qualquer supermercado ou escola.' },
        { termo: 'banana', nome: 'Casca de Banana ou Maçã', bin: 'Castanho (Composteira)', motivo: 'Excelente matéria orgânica que vira adubo fértil!' },
        { termo: 'telemovel', nome: 'Telemóvel ou Computador Estragado', bin: 'Ponto Eletrão / Loja de Tecnologia', motivo: 'As lojas de eletrodomésticos têm obrigação de recolher aparelhos para reciclagem.' },
        { termo: 'lampada', nome: 'Lâmpada Fundida', bin: 'Ponto Eletrão / Loja', motivo: 'Lâmpadas fluorescentes e LED contêm gases e componentes que não devem ir para o vidro comum.' }
    ];

    const wasteInput = document.getElementById('waste-input');
    const wasteResult = document.getElementById('waste-result');
    const wasteResTitle = document.getElementById('waste-res-title');
    const wasteResDesc = document.getElementById('waste-res-desc');

    if (wasteInput && wasteResult) {
        wasteInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                wasteResult.style.display = 'none';
                return;
            }

            const match = wasteDatabase.find(item => item.termo.includes(query) || item.nome.toLowerCase().includes(query));

            if (match) {
                wasteResult.style.display = 'block';
                wasteResTitle.textContent = `${match.nome} ➔ Ecoponto ${match.bin}`;
                wasteResDesc.textContent = match.motivo;
            } else {
                wasteResult.style.display = 'block';
                wasteResTitle.textContent = 'Não encontramos o resíduo exato';
                wasteResDesc.textContent = 'Se for papel limpo vai para o Azul, embalagem plástica/metálica para o Amarelo, garrafa de vidro para o Verde, e restos alimentares para a Composteira!';
            }
        });
    }

    // 3. Simulador de Crescimento de Planta
    const plantStages = [
        { src: 'imagens/pagina-learn/Planta-inicial.png', label: 'Fase 1: Semente no Solo (Início)' },
        { src: 'imagens/pagina-learn/Planta1.png', label: 'Fase 2: Primeiro Broto a Germinar com Nutrientes 🌱' },
        { src: 'imagens/pagina-learn/Planta2.png', label: 'Fase 3: Caule Forte e Folhas Verdes 🌿' },
        { src: 'imagens/pagina-learn/Planta-final.png', label: 'Fase 4: Planta Adulta e Flor Florescente! 🌸' }
    ];

    let currentPlantStage = 0;
    const plantImg = document.getElementById('sim-plant-img');
    const plantLabel = document.getElementById('sim-plant-stage');
    const btnFeed = document.getElementById('btn-feed-compost');
    const btnReset = document.getElementById('btn-reset-compost');

    function updatePlantDisplay() {
        const stage = plantStages[currentPlantStage];
        if (plantImg && stage) {
            plantImg.classList.add('counter-bump');
            plantImg.src = stage.src;
            setTimeout(() => plantImg.classList.remove('counter-bump'), 300);
        }
        if (plantLabel && stage) {
            plantLabel.textContent = stage.label;
        }

        if (btnFeed) {
            btnFeed.disabled = currentPlantStage >= plantStages.length - 1;
            if (btnFeed.disabled) {
                btnFeed.textContent = '🎉 Planta 100% Florescida!';
            } else {
                btnFeed.textContent = '🍎 Adicionar Composto Natural (+1)';
            }
        }
    }

    if (btnFeed) {
        btnFeed.addEventListener('click', () => {
            if (currentPlantStage < plantStages.length - 1) {
                currentPlantStage++;
                if (window.audioManager) window.audioManager.play('certo');
                updatePlantDisplay();
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            currentPlantStage = 0;
            updatePlantDisplay();
        });
    }
});