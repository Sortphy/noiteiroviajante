// Lista de cidades principais de Santa Catarina
const scCities = [
    { name: "Florianópolis", lat: -27.5969, lng: -48.5495 },
    { name: "Joinville", lat: -26.3045, lng: -48.8487 },
    { name: "Blumenau", lat: -26.9155, lng: -49.0709 },
    { name: "São José", lat: -27.6136, lng: -48.6366 },
    { name: "Chapecó", lat: -27.1004, lng: -52.6152 },
    { name: "Itajaí", lat: -26.9101, lng: -48.6705 },
    { name: "Criciúma", lat: -28.6775, lng: -49.3729 },
    { name: "Jaraguá do Sul", lat: -26.4851, lng: -49.0713 },
    { name: "Palhoça", lat: -27.6455, lng: -48.6697 },
    { name: "Lages", lat: -27.8154, lng: -50.3262 },
    { name: "Balneário Camboriú", lat: -26.9930, lng: -48.6354 },
    { name: "Brusque", lat: -27.0977, lng: -48.9107 },
    { name: "Tubarão", lat: -28.4713, lng: -49.0144 },
    { name: "São Bento do Sul", lat: -26.2495, lng: -49.3831 },
    { name: "Caçador", lat: -26.7756, lng: -51.0143 },
    { name: "Concórdia", lat: -27.2341, lng: -52.0281 },
    { name: "Rio do Sul", lat: -27.2156, lng: -49.6430 },
    { name: "Içara", lat: -28.7132, lng: -49.3087 },
    { name: "Araranguá", lat: -28.9356, lng: -49.4936 },
    { name: "Navegantes", lat: -26.8943, lng: -48.6546 },
    { name: "Canoinhas", lat: -26.1766, lng: -50.3900 },
    { name: "Gaspar", lat: -26.9336, lng: -48.9587 },
    { name: "Mafra", lat: -26.1159, lng: -49.8086 },
    { name: "Camboriú", lat: -27.0241, lng: -48.6515 },
    { name: "Videira", lat: -27.0086, lng: -51.1543 }
];

// Função para carregar as cidades nos selects
function loadCities() {
    const startCitySelect = document.getElementById('start-city');
    const endCitySelect = document.getElementById('end-city');
    
    // Limpar opções existentes
    startCitySelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    endCitySelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    
    // Adicionar cidades ordenadas alfabeticamente
    scCities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
        const startOption = document.createElement('option');
        startOption.value = JSON.stringify({name: city.name, lat: city.lat, lng: city.lng});
        startOption.textContent = city.name;
        startCitySelect.appendChild(startOption);
        
        const endOption = document.createElement('option');
        endOption.value = JSON.stringify({name: city.name, lat: city.lat, lng: city.lng});
        endOption.textContent = city.name;
        endCitySelect.appendChild(endOption);
    });
}

// Função para obter cidade por nome
function getCityByName(name) {
    return scCities.find(city => city.name === name);
}

// Função para calcular distância entre duas coordenadas (em km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Função para verificar se um ponto está dentro de um raio de uma linha
function isPointNearLine(point, line, radius) {
    // Implementação simplificada: verifica se o ponto está dentro do raio de qualquer ponto da linha
    for (let i = 0; i < line.length - 1; i++) {
        const start = line[i];
        const end = line[i + 1];
        
        // Calcular distância do ponto para o segmento de linha
        const distance = distanceToSegment(
            point.lat, point.lng,
            start.lat, start.lng,
            end.lat, end.lng
        );
        
        if (distance <= radius) {
            return true;
        }
    }
    return false;
}

// Função para calcular a distância de um ponto para um segmento de linha
function distanceToSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    
    if (len_sq !== 0) {
        param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    
    // Converter para km
    return calculateDistance(px, py, xx, yy);
}
