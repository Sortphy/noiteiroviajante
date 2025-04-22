/**
 * Módulo para detecção e gerenciamento de casas noturnas e estabelecimentos adultos
 * próximos a uma rota específica em Santa Catarina
 */

// Lista de casas noturnas simuladas em Santa Catarina
// Em uma aplicação real, esses dados viriam de uma API como Google Places ou OpenStreetMap
const mockVenues = [
    // Região de Florianópolis
    { id: 1, name: "Concorde Club", type: "Casa Noturna", lat: -27.5930, lng: -48.5480, rating: 4.2, address: "Centro, Florianópolis" },
    { id: 2, name: "Bokarra", type: "Casa Noturna", lat: -27.5890, lng: -48.5520, rating: 4.5, address: "Av. Rio Branco, Florianópolis" },
    { id: 3, name: "Clube Privê", type: "Casa Noturna", lat: -27.6010, lng: -48.5430, rating: 3.9, address: "Estreito, Florianópolis" },
    
    // Região de Joinville
    { id: 4, name: "Enigma Club", type: "Casa Noturna", lat: -26.3030, lng: -48.8450, rating: 4.1, address: "Centro, Joinville" },
    { id: 5, name: "Platinum", type: "Casa Noturna", lat: -26.3080, lng: -48.8490, rating: 4.3, address: "Av. Getúlio Vargas, Joinville" },
    
    // Região de Blumenau
    { id: 6, name: "Mansão Blumenau", type: "Casa Noturna", lat: -26.9140, lng: -49.0680, rating: 4.4, address: "Centro, Blumenau" },
    { id: 7, name: "Paradiso Club", type: "Casa Noturna", lat: -26.9180, lng: -49.0720, rating: 4.0, address: "Itoupava Norte, Blumenau" },
    
    // Região de Balneário Camboriú
    { id: 8, name: "Café Cancun", type: "Casa Noturna", lat: -26.9910, lng: -48.6330, rating: 4.7, address: "Av. Atlântica, Balneário Camboriú" },
    { id: 9, name: "Bahamas Club", type: "Casa Noturna", lat: -26.9950, lng: -48.6350, rating: 4.6, address: "Centro, Balneário Camboriú" },
    { id: 10, name: "Vip's Club", type: "Casa Noturna", lat: -26.9980, lng: -48.6380, rating: 4.2, address: "Barra Sul, Balneário Camboriú" },
    
    // Região de Criciúma
    { id: 11, name: "Privê Criciúma", type: "Casa Noturna", lat: -28.6760, lng: -49.3700, rating: 3.8, address: "Centro, Criciúma" },
    { id: 12, name: "Sedução Club", type: "Casa Noturna", lat: -28.6790, lng: -49.3740, rating: 4.0, address: "Próspera, Criciúma" },
    
    // Região de Itajaí
    { id: 13, name: "Itajaí Night Club", type: "Casa Noturna", lat: -26.9080, lng: -48.6680, rating: 3.9, address: "Centro, Itajaí" },
    { id: 14, name: "Sensações", type: "Casa Noturna", lat: -26.9120, lng: -48.6710, rating: 4.1, address: "Fazenda, Itajaí" },
    
    // Região de Chapecó
    { id: 15, name: "Chapecó VIP", type: "Casa Noturna", lat: -27.0990, lng: -52.6130, rating: 3.7, address: "Centro, Chapecó" },
    
    // Região de Lages
    { id: 16, name: "Montanha Club", type: "Casa Noturna", lat: -27.8140, lng: -50.3240, rating: 3.8, address: "Centro, Lages" },
    
    // Região de Tubarão
    { id: 17, name: "Tubarão Night", type: "Casa Noturna", lat: -28.4700, lng: -49.0120, rating: 3.9, address: "Centro, Tubarão" },
    
    // Região de São José
    { id: 18, name: "São José Club", type: "Casa Noturna", lat: -27.6120, lng: -48.6340, rating: 4.0, address: "Kobrasol, São José" },
    { id: 19, name: "Paraíso Noturno", type: "Casa Noturna", lat: -27.6150, lng: -48.6380, rating: 4.2, address: "Campinas, São José" },
    
    // Região de Palhoça
    { id: 20, name: "Palhoça VIP", type: "Casa Noturna", lat: -27.6440, lng: -48.6680, rating: 3.8, address: "Centro, Palhoça" }
];

// Função para encontrar casas noturnas próximas a uma rota
function findVenuesNearRoute(route, radius) {
    const nearbyVenues = [];
    
    // Converter raio de km para metros
    const radiusInKm = radius;
    
    // Verificar cada casa noturna
    mockVenues.forEach(venue => {
        // Verificar se a casa noturna está dentro do raio da rota
        if (isPointNearLine({lat: venue.lat, lng: venue.lng}, route, radiusInKm)) {
            nearbyVenues.push(venue);
        }
    });
    
    return nearbyVenues;
}

// Função para criar marcadores para as casas noturnas no mapa
function createVenueMarkers(venues, map) {
    const markers = [];
    
    venues.forEach(venue => {
        // Criar ícone personalizado
        const icon = L.divIcon({
            className: 'venue-marker',
            html: '<i class="fas fa-glass-cheers"></i>',
            iconSize: [30, 30]
        });
        
        // Criar marcador
        const marker = L.marker([venue.lat, venue.lng], {
            icon: icon,
            title: venue.name
        });
        
        // Adicionar popup com informações
        marker.bindPopup(`
            <div class="venue-popup">
                <h4>${venue.name}</h4>
                <p><strong>Tipo:</strong> ${venue.type}</p>
                <p><strong>Avaliação:</strong> ${venue.rating} ⭐</p>
                <p><strong>Endereço:</strong> ${venue.address}</p>
            </div>
        `);
        
        // Adicionar ao mapa
        marker.addTo(map);
        markers.push(marker);
    });
    
    return markers;
}

// Função para simular a busca de casas noturnas em uma API real
// Em uma aplicação real, isso usaria a API do Google Places ou similar
function searchVenuesFromAPI(bounds, radius) {
    return new Promise((resolve) => {
        // Simular atraso de rede
        setTimeout(() => {
            // Filtrar casas noturnas dentro dos limites do mapa
            const filteredVenues = mockVenues.filter(venue => {
                return bounds.contains([venue.lat, venue.lng]);
            });
            
            resolve(filteredVenues);
        }, 1000);
    });
}

// Função para converter casas noturnas em waypoints para otimização de rota
function venuesAsWaypoints(venues) {
    return venues.map(venue => {
        return {
            id: `v${venue.id}`,
            lat: venue.lat,
            lng: venue.lng,
            name: venue.name
        };
    });
}
