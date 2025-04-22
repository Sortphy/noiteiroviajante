/**
 * Aplicativo principal do Cafetão Viajante
 * Integra todos os módulos e gerencia a interface do usuário
 */

// Variáveis globais
let map;
let startCity = null;
let endCity = null;
let currentRoute = null;
let venueMarkers = [];
let routeControl = null;
let optimizedRouteLayer = null;
let nearbyVenues = [];

// Inicializar o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadCities();
    setupEventListeners();
    updateUIState();
});

// Inicializar o mapa Leaflet
function initMap() {
    // Criar mapa centralizado em Santa Catarina
    map = L.map('map').setView([-27.5969, -48.5495], 8);
    
    // Adicionar camada de mapa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Adicionar escala
    L.control.scale({imperial: false}).addTo(map);
    
    // Adicionar controle de camadas
    const baseMaps = {
        "Mapa Padrão": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }),
        "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        })
    };
    
    L.control.layers(baseMaps).addTo(map);
}

// Configurar event listeners
function setupEventListeners() {
    // Selecionar cidade de partida
    document.getElementById('start-city').addEventListener('change', (e) => {
        if (e.target.value) {
            startCity = JSON.parse(e.target.value);
            updateUIState();
            updateMapMarkers();
        } else {
            startCity = null;
            updateUIState();
            updateMapMarkers();
        }
    });
    
    // Selecionar cidade de destino
    document.getElementById('end-city').addEventListener('change', (e) => {
        if (e.target.value) {
            endCity = JSON.parse(e.target.value);
            updateUIState();
            updateMapMarkers();
        } else {
            endCity = null;
            updateUIState();
            updateMapMarkers();
        }
    });
    
    // Calcular rota
    document.getElementById('calculate-route').addEventListener('click', () => {
        calculateRoute();
    });
    
    // Encontrar casas noturnas
    document.getElementById('find-venues').addEventListener('click', () => {
        findNearbyVenues();
    });
    
    // Otimizar rota
    document.getElementById('optimize-route').addEventListener('click', () => {
        optimizeRoute();
    });
    
    // Atualizar valor do raio
    document.getElementById('radius').addEventListener('input', (e) => {
        document.getElementById('radius-value').textContent = `${e.target.value} km`;
    });
}

// Atualizar estado da interface com base nas seleções
function updateUIState() {
    const calculateRouteBtn = document.getElementById('calculate-route');
    const findVenuesBtn = document.getElementById('find-venues');
    const optimizeRouteBtn = document.getElementById('optimize-route');
    
    // Habilitar/desabilitar botão de calcular rota
    calculateRouteBtn.disabled = !(startCity && endCity);
    
    // Habilitar/desabilitar botão de encontrar casas noturnas
    findVenuesBtn.disabled = !currentRoute;
    
    // Habilitar/desabilitar botão de otimizar rota
    optimizeRouteBtn.disabled = !(currentRoute && nearbyVenues.length > 0);
    
    // Atualizar informações da rota
    updateRouteInfo();
}

// Atualizar marcadores no mapa
function updateMapMarkers() {
    // Limpar marcadores existentes
    if (map) {
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }
    
    // Adicionar marcador para cidade de partida
    if (startCity) {
        const startIcon = L.divIcon({
            className: 'city-marker',
            html: '<i class="fas fa-play"></i>',
            iconSize: [30, 30]
        });
        
        L.marker([startCity.lat, startCity.lng], {
            icon: startIcon,
            title: `Partida: ${startCity.name}`
        }).addTo(map).bindPopup(`<b>Partida:</b> ${startCity.name}`);
    }
    
    // Adicionar marcador para cidade de destino
    if (endCity) {
        const endIcon = L.divIcon({
            className: 'city-marker',
            html: '<i class="fas fa-flag-checkered"></i>',
            iconSize: [30, 30]
        });
        
        L.marker([endCity.lat, endCity.lng], {
            icon: endIcon,
            title: `Destino: ${endCity.name}`
        }).addTo(map).bindPopup(`<b>Destino:</b> ${endCity.name}`);
    }
    
    // Ajustar visualização do mapa
    if (startCity && endCity) {
        map.fitBounds([
            [startCity.lat, startCity.lng],
            [endCity.lat, endCity.lng]
        ], { padding: [50, 50] });
    } else if (startCity) {
        map.setView([startCity.lat, startCity.lng], 12);
    } else if (endCity) {
        map.setView([endCity.lat, endCity.lng], 12);
    }
}

// Calcular rota entre as cidades selecionadas
function calculateRoute() {
    // Limpar rota anterior
    clearRoute();
    
    // Verificar se temos cidades de partida e destino
    if (!startCity || !endCity) {
        alert('Selecione as cidades de partida e destino');
        return;
    }
    
    // Mostrar mensagem de carregamento
    document.getElementById('route-info').innerHTML = '<p>Calculando rota...</p>';
    
    // Criar controle de rota do Leaflet
    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(startCity.lat, startCity.lng),
            L.latLng(endCity.lat, endCity.lng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        show: false, // Não mostrar painel de instruções
        lineOptions: {
            styles: [
                {color: '#3498db', opacity: 0.8, weight: 6},
                {color: 'white', opacity: 0.3, weight: 4}
            ]
        }
    }).addTo(map);
    
    // Evento quando a rota é calculada
    routeControl.on('routesfound', function(e) {
        const routes = e.routes;
        const route = routes[0]; // Pegar a primeira rota
        
        // Armazenar rota atual
        currentRoute = route.coordinates;
        
        // Atualizar informações da rota
        const distance = (route.summary.totalDistance / 1000).toFixed(1);
        const duration = Math.round(route.summary.totalTime / 60);
        
        document.getElementById('route-info').innerHTML = `
            <p><strong>Distância:</strong> ${distance} km</p>
            <p><strong>Tempo estimado:</strong> ${duration} minutos</p>
            <p>Clique em "Encontrar Casas Noturnas" para detectar estabelecimentos próximos à rota.</p>
        `;
        
        // Atualizar estado da UI
        updateUIState();
    });
    
    // Tratar erros
    routeControl.on('routingerror', function(e) {
        document.getElementById('route-info').innerHTML = `
            <p class="error">Erro ao calcular rota: ${e.error.message}</p>
        `;
    });
}

// Limpar rota atual
function clearRoute() {
    // Remover controle de rota
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
    
    // Remover camada de rota otimizada
    if (optimizedRouteLayer) {
        map.removeLayer(optimizedRouteLayer);
        optimizedRouteLayer = null;
    }
    
    // Remover marcadores de casas noturnas
    clearVenueMarkers();
    
    // Resetar variáveis
    currentRoute = null;
    nearbyVenues = [];
    
    // Atualizar estado da UI
    updateUIState();
}

// Limpar marcadores de casas noturnas
function clearVenueMarkers() {
    venueMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    venueMarkers = [];
    
    document.getElementById('venues-list').innerHTML = '<p>Nenhuma casa noturna encontrada ainda.</p>';
}

// Encontrar casas noturnas próximas à rota
function findNearbyVenues() {
    // Verificar se temos uma rota
    if (!currentRoute) {
        alert('Calcule uma rota primeiro');
        return;
    }
    
    // Limpar marcadores anteriores
    clearVenueMarkers();
    
    // Obter raio de busca
    const radius = parseInt(document.getElementById('radius').value);
    
    // Mostrar mensagem de carregamento
    document.getElementById('venues-list').innerHTML = '<p>Buscando casas noturnas...</p>';
    
    // Encontrar casas noturnas próximas à rota
    nearbyVenues = findVenuesNearRoute(currentRoute, radius);
    
    // Verificar se encontramos casas noturnas
    if (nearbyVenues.length === 0) {
        document.getElementById('venues-list').innerHTML = `
            <p>Nenhuma casa noturna encontrada em um raio de ${radius} km da rota.</p>
            <p>Tente aumentar o raio de busca ou escolher outra rota.</p>
        `;
        updateUIState();
        return;
    }
    
    // Criar marcadores para as casas noturnas
    venueMarkers = createVenueMarkers(nearbyVenues, map);
    
    // Atualizar lista de casas noturnas
    let venuesList = '<ul class="venues-list">';
    nearbyVenues.forEach(venue => {
        venuesList += `
            <li>
                <strong>${venue.name}</strong> (${venue.rating} ⭐)<br>
                ${venue.address}
            </li>
        `;
    });
    venuesList += '</ul>';
    
    document.getElementById('venues-list').innerHTML = `
        <p>Encontradas ${nearbyVenues.length} casas noturnas em um raio de ${radius} km da rota.</p>
        ${venuesList}
        <p>Clique em "Otimizar Rota" para criar um trajeto que passe por todas as casas noturnas.</p>
    `;
    
    // Atualizar estado da UI
    updateUIState();
}

// Otimizar rota para passar por todas as casas noturnas
function optimizeRoute() {
    // Verificar se temos casas noturnas
    if (nearbyVenues.length === 0) {
        alert('Encontre casas noturnas primeiro');
        return;
    }
    
    // Mostrar mensagem de carregamento
    document.getElementById('route-info').innerHTML += '<p>Otimizando rota...</p>';
    
    // Converter casas noturnas em waypoints
    const waypoints = venuesAsWaypoints(nearbyVenues);
    
    // Criar pontos de início e fim
    const start = {
        id: 'start',
        lat: startCity.lat,
        lng: startCity.lng,
        name: startCity.name
    };
    
    const end = {
        id: 'end',
        lat: endCity.lat,
        lng: endCity.lng,
        name: endCity.name
    };
    
    // Otimizar rota
    const optimizedPath = optimizeRouteWithoutRepeatingStreets(start, end, waypoints);
    
    // Verificar se conseguimos otimizar a rota
    if (!optimizedPath) {
        document.getElementById('route-info').innerHTML += `
            <p class="error">Não foi possível otimizar a rota. Tente com menos casas noturnas.</p>
        `;
        return;
    }
    
    // Remover rota original
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
    
    // Remover rota otimizada anterior
    if (optimizedRouteLayer) {
        map.removeLayer(optimizedRouteLayer);
    }
    
    // Criar caminho com as coordenadas otimizadas
    const latlngs = optimizedPath.map(point => [point.lat, point.lng]);
    
    // Criar camada de rota otimizada
    optimizedRouteLayer = L.polyline(latlngs, {
        color: '#e74c3c',
        weight: 6,
        opacity: 0.8
    }).addTo(map);
    
    // Ajustar visualização para mostrar toda a rota
    map.fitBounds(optimizedRouteLayer.getBounds(), { padding: [50, 50] });
    
    // Calcular distância total
    let totalDistance = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
        const p1 = latlngs[i];
        const p2 = latlngs[i + 1];
        totalDistance += calculateDistance(p1[0], p1[1], p2[0], p2[1]);
    }
    
    // Estimar tempo (assumindo velocidade média de 50 km/h)
    const estimatedTime = Math.round((totalDistance / 50) * 60);
    
    // Atualizar informações da rota
    document.getElementById('route-info').innerHTML = `
        <p><strong>Rota otimizada!</strong></p>
        <p><strong>Distância total:</strong> ${totalDistance.toFixed(1)} km</p>
        <p><strong>Tempo estimado:</strong> ${estimatedTime} minutos</p>
        <p><strong>Casas noturnas incluídas:</strong> ${nearbyVenues.length}</p>
        <p>A rota foi otimizada para passar por todas as casas noturnas sem repetir ruas.</p>
    `;
}

// Atualizar informações da rota
function updateRouteInfo() {
    if (!startCity || !endCity) {
        document.getElementById('route-info').innerHTML = `
            <p>Selecione as cidades de partida e destino para calcular a rota.</p>
        `;
    } else if (!currentRoute) {
        document.getElementById('route-info').innerHTML = `
            <p>Clique em "Calcular Rota" para encontrar o caminho mais curto entre ${startCity.name} e ${endCity.name}.</p>
        `;
    }
}
