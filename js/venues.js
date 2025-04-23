/**
 * Módulo para detecção e gerenciamento de casas noturnas e estabelecimentos adultos
 * próximos a uma rota específica em Santa Catarina
 */

// Lista expandida de casas noturnas em Santa Catarina
// Em uma aplicação real, esses dados viriam de uma API como Google Places ou OpenStreetMap
const mockVenues = [
    // Região de Florianópolis
    { id: 1, name: "Concorde Club", type: "Casa Noturna", lat: -27.5930, lng: -48.5480, rating: 4.2, address: "Centro, Florianópolis" },
    { id: 2, name: "Bokarra", type: "Casa Noturna", lat: -27.5890, lng: -48.5520, rating: 4.5, address: "Av. Rio Branco, Florianópolis" },
    { id: 3, name: "Clube Privê", type: "Casa Noturna", lat: -27.6010, lng: -48.5430, rating: 3.9, address: "Estreito, Florianópolis" },
    { id: 4, name: "Motel Meiembipe", type: "Motel", lat: -27.5850, lng: -48.5550, rating: 4.0, address: "SC-401, Florianópolis" },
    { id: 5, name: "Boate Ibiza", type: "Casa Noturna", lat: -27.5970, lng: -48.5510, rating: 4.3, address: "Lagoa da Conceição, Florianópolis" },
    
    // Região de Joinville
    { id: 6, name: "Enigma Club", type: "Casa Noturna", lat: -26.3030, lng: -48.8450, rating: 4.1, address: "Centro, Joinville" },
    { id: 7, name: "Platinum", type: "Casa Noturna", lat: -26.3080, lng: -48.8490, rating: 4.3, address: "Av. Getúlio Vargas, Joinville" },
    { id: 8, name: "Motel Caribe", type: "Motel", lat: -26.3150, lng: -48.8520, rating: 4.2, address: "BR-101, Joinville" },
    { id: 9, name: "Privê Joinville", type: "Casa Noturna", lat: -26.3050, lng: -48.8470, rating: 3.9, address: "Bucarein, Joinville" },
    { id: 10, name: "Boate Glamour", type: "Casa Noturna", lat: -26.3100, lng: -48.8430, rating: 4.0, address: "América, Joinville" },
    
    // Região de Blumenau
    { id: 11, name: "Mansão Blumenau", type: "Casa Noturna", lat: -26.9140, lng: -49.0680, rating: 4.4, address: "Centro, Blumenau" },
    { id: 12, name: "Paradiso Club", type: "Casa Noturna", lat: -26.9180, lng: -49.0720, rating: 4.0, address: "Itoupava Norte, Blumenau" },
    { id: 13, name: "Motel Blumenau", type: "Motel", lat: -26.9200, lng: -49.0650, rating: 4.3, address: "BR-470, Blumenau" },
    { id: 14, name: "Boate Oktoberfest", type: "Casa Noturna", lat: -26.9160, lng: -49.0700, rating: 4.5, address: "Vila Nova, Blumenau" },
    { id: 15, name: "Clube Privê Blumenau", type: "Casa Noturna", lat: -26.9130, lng: -49.0690, rating: 3.8, address: "Velha, Blumenau" },
    
    // Região de Balneário Camboriú
    { id: 16, name: "Café Cancun", type: "Casa Noturna", lat: -26.9910, lng: -48.6330, rating: 4.7, address: "Av. Atlântica, Balneário Camboriú" },
    { id: 17, name: "Bahamas Club", type: "Casa Noturna", lat: -26.9950, lng: -48.6350, rating: 4.6, address: "Centro, Balneário Camboriú" },
    { id: 18, name: "Vip's Club", type: "Casa Noturna", lat: -26.9980, lng: -48.6380, rating: 4.2, address: "Barra Sul, Balneário Camboriú" },
    { id: 19, name: "Motel Caravelle", type: "Motel", lat: -27.0010, lng: -48.6320, rating: 4.5, address: "BR-101, Balneário Camboriú" },
    { id: 20, name: "Boate Privilege", type: "Casa Noturna", lat: -26.9930, lng: -48.6340, rating: 4.4, address: "Pioneiros, Balneário Camboriú" },
    
    // Região de Criciúma
    { id: 21, name: "Privê Criciúma", type: "Casa Noturna", lat: -28.6760, lng: -49.3700, rating: 3.8, address: "Centro, Criciúma" },
    { id: 22, name: "Sedução Club", type: "Casa Noturna", lat: -28.6790, lng: -49.3740, rating: 4.0, address: "Próspera, Criciúma" },
    { id: 23, name: "Motel Criciúma", type: "Motel", lat: -28.6820, lng: -49.3680, rating: 3.9, address: "BR-101, Criciúma" },
    { id: 24, name: "Boate Mineira", type: "Casa Noturna", lat: -28.6770, lng: -49.3720, rating: 3.7, address: "Santa Bárbara, Criciúma" },
    { id: 25, name: "Clube Privê Sul", type: "Casa Noturna", lat: -28.6750, lng: -49.3710, rating: 4.1, address: "Comerciário, Criciúma" },
    
    // Região de Itajaí
    { id: 26, name: "Itajaí Night Club", type: "Casa Noturna", lat: -26.9080, lng: -48.6680, rating: 3.9, address: "Centro, Itajaí" },
    { id: 27, name: "Sensações", type: "Casa Noturna", lat: -26.9120, lng: -48.6710, rating: 4.1, address: "Fazenda, Itajaí" },
    { id: 28, name: "Motel Navegantes", type: "Motel", lat: -26.9050, lng: -48.6650, rating: 4.0, address: "BR-101, Itajaí" },
    { id: 29, name: "Boate Portuária", type: "Casa Noturna", lat: -26.9100, lng: -48.6690, rating: 3.8, address: "São Vicente, Itajaí" },
    { id: 30, name: "Clube Privê Itajaí", type: "Casa Noturna", lat: -26.9070, lng: -48.6700, rating: 4.2, address: "Dom Bosco, Itajaí" },
    
    // Região de Chapecó
    { id: 31, name: "Chapecó VIP", type: "Casa Noturna", lat: -27.0990, lng: -52.6130, rating: 3.7, address: "Centro, Chapecó" },
    { id: 32, name: "Oeste Club", type: "Casa Noturna", lat: -27.1010, lng: -52.6150, rating: 3.9, address: "São Cristóvão, Chapecó" },
    { id: 33, name: "Motel Chapecó", type: "Motel", lat: -27.1030, lng: -52.6100, rating: 3.8, address: "BR-282, Chapecó" },
    { id: 34, name: "Boate Fronteira", type: "Casa Noturna", lat: -27.0980, lng: -52.6140, rating: 4.0, address: "Passo dos Fortes, Chapecó" },
    { id: 35, name: "Clube Privê Oeste", type: "Casa Noturna", lat: -27.1000, lng: -52.6120, rating: 3.6, address: "Efapi, Chapecó" },
    
    // Região de Lages
    { id: 36, name: "Montanha Club", type: "Casa Noturna", lat: -27.8140, lng: -50.3240, rating: 3.8, address: "Centro, Lages" },
    { id: 37, name: "Serra Club", type: "Casa Noturna", lat: -27.8160, lng: -50.3260, rating: 3.7, address: "Coral, Lages" },
    { id: 38, name: "Motel Lages", type: "Motel", lat: -27.8180, lng: -50.3220, rating: 3.9, address: "BR-116, Lages" },
    { id: 39, name: "Boate Serrana", type: "Casa Noturna", lat: -27.8130, lng: -50.3250, rating: 3.6, address: "São Cristóvão, Lages" },
    { id: 40, name: "Clube Privê Serra", type: "Casa Noturna", lat: -27.8150, lng: -50.3230, rating: 4.0, address: "Universitário, Lages" },
    
    // Região de Tubarão
    { id: 41, name: "Tubarão Night", type: "Casa Noturna", lat: -28.4700, lng: -49.0120, rating: 3.9, address: "Centro, Tubarão" },
    { id: 42, name: "Sul Club", type: "Casa Noturna", lat: -28.4720, lng: -49.0140, rating: 3.8, address: "Oficinas, Tubarão" },
    { id: 43, name: "Motel Tubarão", type: "Motel", lat: -28.4740, lng: -49.0100, rating: 4.0, address: "BR-101, Tubarão" },
    { id: 44, name: "Boate Balneário", type: "Casa Noturna", lat: -28.4690, lng: -49.0130, rating: 3.7, address: "Humaitá, Tubarão" },
    { id: 45, name: "Clube Privê Sul", type: "Casa Noturna", lat: -28.4710, lng: -49.0110, rating: 4.1, address: "Vila Moema, Tubarão" },
    
    // Região de São José
    { id: 46, name: "São José Club", type: "Casa Noturna", lat: -27.6120, lng: -48.6340, rating: 4.0, address: "Kobrasol, São José" },
    { id: 47, name: "Paraíso Noturno", type: "Casa Noturna", lat: -27.6150, lng: -48.6380, rating: 4.2, address: "Campinas, São José" },
    { id: 48, name: "Motel São José", type: "Motel", lat: -27.6180, lng: -48.6320, rating: 4.1, address: "BR-101, São José" },
    { id: 49, name: "Boate Metropolitana", type: "Casa Noturna", lat: -27.6130, lng: -48.6360, rating: 3.9, address: "Barreiros, São José" },
    { id: 50, name: "Clube Privê Continental", type: "Casa Noturna", lat: -27.6140, lng: -48.6350, rating: 4.3, address: "Bela Vista, São José" },
    
    // Região de Palhoça
    { id: 51, name: "Palhoça VIP", type: "Casa Noturna", lat: -27.6440, lng: -48.6680, rating: 3.8, address: "Centro, Palhoça" },
    { id: 52, name: "Costa Club", type: "Casa Noturna", lat: -27.6460, lng: -48.6700, rating: 3.9, address: "Ponte do Imaruim, Palhoça" },
    { id: 53, name: "Motel Palhoça", type: "Motel", lat: -27.6480, lng: -48.6660, rating: 4.0, address: "BR-101, Palhoça" },
    { id: 54, name: "Boate Litoral", type: "Casa Noturna", lat: -27.6430, lng: -48.6690, rating: 3.7, address: "Aririú, Palhoça" },
    { id: 55, name: "Clube Privê Palhoça", type: "Casa Noturna", lat: -27.6450, lng: -48.6670, rating: 4.1, address: "Pagani, Palhoça" },
    
    // Região de Jaraguá do Sul
    { id: 56, name: "Jaraguá Club", type: "Casa Noturna", lat: -26.4840, lng: -49.0700, rating: 3.9, address: "Centro, Jaraguá do Sul" },
    { id: 57, name: "Norte Club", type: "Casa Noturna", lat: -26.4860, lng: -49.0720, rating: 4.0, address: "Vila Nova, Jaraguá do Sul" },
    { id: 58, name: "Motel Jaraguá", type: "Motel", lat: -26.4880, lng: -49.0680, rating: 4.1, address: "BR-280, Jaraguá do Sul" },
    { id: 59, name: "Boate Industrial", type: "Casa Noturna", lat: -26.4830, lng: -49.0710, rating: 3.8, address: "Baependi, Jaraguá do Sul" },
    { id: 60, name: "Clube Privê Jaraguá", type: "Casa Noturna", lat: -26.4850, lng: -49.0690, rating: 4.2, address: "Czerniewicz, Jaraguá do Sul" },
    
    // Região de Brusque
    { id: 61, name: "Brusque Night", type: "Casa Noturna", lat: -27.0970, lng: -48.9100, rating: 3.8, address: "Centro, Brusque" },
    { id: 62, name: "Têxtil Club", type: "Casa Noturna", lat: -27.0990, lng: -48.9120, rating: 3.9, address: "Santa Terezinha, Brusque" },
    { id: 63, name: "Motel Brusque", type: "Motel", lat: -27.1010, lng: -48.9080, rating: 4.0, address: "SC-486, Brusque" },
    { id: 64, name: "Boate Azambuja", type: "Casa Noturna", lat: -27.0960, lng: -48.9110, rating: 3.7, address: "Azambuja, Brusque" },
    { id: 65, name: "Clube Privê Brusque", type: "Casa Noturna", lat: -27.0980, lng: -48.9090, rating: 4.1, address: "Santa Rita, Brusque" },
    
    // Região de Rio do Sul
    { id: 66, name: "Rio do Sul Club", type: "Casa Noturna", lat: -27.2150, lng: -49.6420, rating: 3.7, address: "Centro, Rio do Sul" },
    { id: 67, name: "Vale Club", type: "Casa Noturna", lat: -27.2170, lng: -49.6440, rating: 3.8, address: "Canoas, Rio do Sul" },
    { id: 68, name: "Motel Rio do Sul", type: "Motel", lat: -27.2190, lng: -49.6400, rating: 3.9, address: "BR-470, Rio do Sul" },
    { id: 69, name: "Boate Itajaí-Açu", type: "Casa Noturna", lat: -27.2140, lng: -49.6430, rating: 3.6, address: "Barragem, Rio do Sul" },
    { id: 70, name: "Clube Privê Vale", type: "Casa Noturna", lat: -27.2160, lng: -49.6410, rating: 4.0, address: "Jardim América, Rio do Sul" },
    
    // Região de São Bento do Sul
    { id: 71, name: "São Bento Club", type: "Casa Noturna", lat: -26.2490, lng: -49.3820, rating: 3.6, address: "Centro, São Bento do Sul" },
    { id: 72, name: "Serra Club", type: "Casa Noturna", lat: -26.2510, lng: -49.3840, rating: 3.7, address: "Oxford, São Bento do Sul" },
    { id: 73, name: "Motel São Bento", type: "Motel", lat: -26.2530, lng: -49.3800, rating: 3.8, address: "SC-301, São Bento do Sul" },
    { id: 74, name: "Boate Planalto", type: "Casa Noturna", lat: -26.2480, lng: -49.3830, rating: 3.5, address: "Serra Alta, São Bento do Sul" },
    { id: 75, name: "Clube Privê São Bento", type: "Casa Noturna", lat: -26.2500, lng: -49.3810, rating: 3.9, address: "Colonial, São Bento do Sul" },
    
    // Região de Caçador
    { id: 76, name: "Caçador Club", type: "Casa Noturna", lat: -26.7750, lng: -51.0140, rating: 3.5, address: "Centro, Caçador" },
    { id: 77, name: "Oeste Club", type: "Casa Noturna", lat: -26.7770, lng: -51.0160, rating: 3.6, address: "Santa Catarina, Caçador" },
    { id: 78, name: "Motel Caçador", type: "Motel", lat: -26.7790, lng: -51.0120, rating: 3.7, address: "BR-116, Caçador" },
    { id: 79, name: "Boate Contestado", type: "Casa Noturna", lat: -26.7740, lng: -51.0150, rating: 3.4, address: "Berger, Caçador" },
    { id: 80, name: "Clube Privê Caçador", type: "Casa Noturna", lat: -26.7760, lng: -51.0130, rating: 3.8, address: "Reunidas, Caçador" }
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
