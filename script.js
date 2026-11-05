// Dados fictícios estruturados em arrays e objetos (Conforme exigido)
const routesData = [
    {
        id: "L1-AZUL",
        lineName: "Linha 1 - Azul",
        operator: "Metrô",
        colorBg: "#00539F",
        origin: "Tucuruvi",
        destination: "Jabaquara",
        durationMinutes: 45,
        accessible: true,
        stopsCount: 23,
        frequency: "3 minutos nos horários de pico",
        stops: ["Tucuruvi", "Parada Inglesa", "Santana", "Luz", "Sé", "Paraíso", "Ana Rosa", "Jabaquara"]
    },
    {
        id: "L2-VERDE",
        lineName: "Linha 2 - Verde",
        operator: "Metrô",
        colorBg: "#008559",
        origin: "Vila Madalena",
        destination: "Vila Prudente",
        durationMinutes: 28,
        accessible: true,
        stopsCount: 14,
        frequency: "3 a 4 minutos nos horários de pico",
        stops: ["Vila Madalena", "Sumaré", "Clínicas", "Consolação", "Paulista", "Paraíso", "Ana Rosa", "Vila Prudente"]
    },
    {
        id: "L3-VERMELHA",
        lineName: "Linha 3 - Vermelha",
        operator: "Metrô",
        colorBg: "#EE3124",
        origin: "Palmeiras-Barra Funda",
        destination: "Corinthians-Itaquera",
        durationMinutes: 35,
        accessible: true,
        stopsCount: 18,
        frequency: "2 a 3 minutos nos horários de pico",
        stops: ["Palmeiras-Barra Funda", "República", "Anhangabaú", "Sé", "Brás", "Tatuapé", "Corinthians-Itaquera"]
    },
    {
        id: "L4-AMARELA",
        lineName: "Linha 4 - Amarela",
        operator: "ViaQuatro",
        colorBg: "#C69214",
        origin: "Vila Sônia",
        destination: "Luz",
        durationMinutes: 22,
        accessible: false,
        stopsCount: 11,
        frequency: "2 minutos nos horários de pico",
        stops: ["Vila Sônia", "São Paulo-Morumbi", "Butantã", "Pinheiros", "Faria Lima", "Paulista", "República", "Luz"]
    },
    {
        id: "L5-LILAS",
        lineName: "Linha 5 - Lilás",
        operator: "ViaMobilidade",
        colorBg: "#9B3894",
        origin: "Capão Redondo",
        destination: "Chácara Klabin",
        durationMinutes: 33,
        accessible: true,
        stopsCount: 17,
        frequency: "3 a 4 minutos nos horários de pico",
        stops: ["Capão Redondo", "Campo Limpo", "Santo Amaro", "Brooklin", "Campo Belo", "Santa Cruz", "Chácara Klabin"]
    }
];

// Elementos do DOM
const routesContainer = document.getElementById('routesContainer');
const searchInput = document.getElementById('searchInput');
const accessibilityFilter = document.getElementById('accessibilityFilter');
const noResults = document.getElementById('noResults');

const routeASelect = document.getElementById('routeASelect');
const routeBSelect = document.getElementById('routeBSelect');
const compareBtn = document.getElementById('compareBtn');
const comparisonResult = document.getElementById('comparisonResult');

const routeModal = document.getElementById('routeModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Inicialização da Aplicação
function init() {
    renderRoutes(routesData);
    populateComparisonSelects();
    setupEventListeners();
}

// Renderização dos Trajetos
function renderRoutes(data) {
    routesContainer.innerHTML = '';
    
    if (data.length === 0) {
        noResults.classList.remove('hidden');
        return;
    } else {
        noResults.classList.add('hidden');
    }

    data.forEach(route => {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.innerHTML = `
            <div>
                <div class="route-header-card">
                    <span class="route-id" style="background-color: ${route.colorBg};">${route.id}</span>
                    <span class="route-operator">${route.operator}</span>
                </div>
                <h3 style="font-size: 16px; margin-bottom: 10px; color: #111827;">${route.lineName}</h3>
                <div class="route-details-info">
                    <p><strong>Origem:</strong> ${route.origin}</p>
                    <p><strong>Destino:</strong> ${route.destination}</p>
                    <p><strong>Duração Estimada:</strong> ${route.durationMinutes} minutos</p>
                </div>
            </div>
            <div class="route-footer-card">
            <span class="accessibility-badge ${route.accessible ? 'accessible' : 'not-accessible'}">${route.accessible ? 'Acessibilidade Total' : 'Acessibilidade Parcial'}</span>
            <button class="detail-btn" onclick="openRouteDetails('${route.id}')">Ver Detalhes</button>
            </div>
        `;
        routesContainer.appendChild(card);
    });
}

// Preencher selects do comparador
function populateComparisonSelects() {
    routesData.forEach(route => {
        const optionA = document.createElement('option');
        optionA.value = route.id;
        optionA.textContent = `${route.lineName} (${route.origin} -> ${route.destination})`;
        routeASelect.appendChild(optionA);

        const optionB = document.createElement('option');
        optionB.value = route.id;
        optionB.textContent = `${route.lineName} (${route.origin} -> ${route.destination})`;
        routeBSelect.appendChild(optionB);
    });
}

// Filtragem e Busca
function filterData() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const accessibilityValue = accessibilityFilter.value;

    const filtered = routesData.filter(route => {
        const matchesSearch = 
            route.lineName.toLowerCase().includes(searchTerm) ||
            route.origin.toLowerCase().includes(searchTerm) ||
            route.destination.toLowerCase().includes(searchTerm) ||
            route.id.toLowerCase().includes(searchTerm);

        const matchesAccessibility = 
            accessibilityValue === 'all' || (accessibilityValue === 'accessible' && route.accessible);

        return matchesSearch && matchesAccessibility;
    });

    renderRoutes(filtered);
}

// Funcionalidade Adicional: Comparação de Trajetos
function compareRoutes() {
    const routeA = routesData.find(route => route.id === routeASelect.value);
    const routeB = routesData.find(route => route.id === routeBSelect.value);

    if (!routeA || !routeB) {
        comparisonResult.innerHTML = `
            <p>Selecione duas linhas para comparar.</p>
        `;
        return;
    }

    if (routeA.id === routeB.id) {
        comparisonResult.innerHTML = `
            <p>Selecione duas linhas diferentes para comparar.</p>
        `;
        return;
    }

    let timeMessage;

    if (routeA.durationMinutes < routeB.durationMinutes) {
        const difference = routeB.durationMinutes - routeA.durationMinutes;
        timeMessage = `${routeA.lineName} é mais rápida por ${difference} minutos.`;
    } else if (routeB.durationMinutes < routeA.durationMinutes) {
        const difference = routeA.durationMinutes - routeB.durationMinutes;
        timeMessage = `${routeB.lineName} é mais rápida por ${difference} minutos.`;
    } else {
        timeMessage = "As duas linhas possuem o mesmo tempo estimado.";
    }

    comparisonResult.innerHTML = `
        <div class="comparison-summary">
            <h3>Resultado da comparação</h3>

            <p>${timeMessage}</p>

            <div class="accessibility-comparison">
                <p>
                    <strong>${routeA.lineName}</strong><br>
                    Tempo: ${routeA.durationMinutes} minutos<br>
                    Acessibilidade: ${routeA.accessible
                        ? "Possui acessibilidade"
                        : "Não possui acessibilidade completa"}
                </p>

                <p>
                    <strong>${routeB.lineName}</strong><br>
                    Tempo: ${routeB.durationMinutes} minutos<br>
                    Acessibilidade: ${routeB.accessible
                        ? "Possui acessibilidade"
                        : "Não possui acessibilidade completa"}
                </p>
            </div>
        </div>
    `;
}

// Detalhes do Trajeto (Modal)
window.openRouteDetails = function(routeId) {
    const route = routesData.find(r => r.id === routeId);
    if (!route) return;

    modalTitle.textContent = route.lineName;
    modalBody.innerHTML = `
        <p><strong>Operadora:</strong> ${route.operator}</p>
        <p><strong>Trajeto:</strong> ${route.origin} até ${route.destination}</p>
        <p><strong>Tempo Estimado:</strong> ${route.durationMinutes} minutos</p>
        <p><strong>Frequência Média:</strong> ${route.frequency}</p>
        <p><strong>Total de Paradas Principais:</strong> ${route.stopsCount}</p>
        <p><strong>Condição de Acessibilidade:</strong> ${route.accessible ? 'Elevadores operacionais, pisos táteis e rampas disponíveis em toda a extensão.' : 'Parcialmente adaptado.'}</p>
        <p><strong>Principais Estações do Trajeto:</strong></p>
        <ul class="stops-list">
            ${route.stops.map(stop => `<li>${stop}</li>`).join('')}
        </ul>
    `;
    routeModal.classList.remove('hidden');
};

// Fechar Modal
closeModal.addEventListener('click', () => {
    routeModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === routeModal) {
        routeModal.classList.add('hidden');
    }
});

// Event Listeners


function setupEventListeners() {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        filterData();
    });

    accessibilityFilter.addEventListener('change', filterData);

    compareBtn.addEventListener('click', compareRoutes);
}


// Executar aplicação ao carregar
document.addEventListener('DOMContentLoaded', init);