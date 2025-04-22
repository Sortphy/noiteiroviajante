/**
 * Implementação do algoritmo A* para encontrar o caminho mais curto entre dois pontos
 * 
 * O algoritmo A* é uma extensão do algoritmo de Dijkstra que usa uma heurística
 * para guiar a busca na direção do objetivo, tornando-o mais eficiente.
 */

class AStar {
    constructor(graph) {
        this.graph = graph;
    }
    
    // Método principal para encontrar o caminho mais curto
    findPath(start, goal) {
        // Conjunto de nós já avaliados
        const closedSet = new Set();
        
        // Conjunto de nós descobertos que ainda precisam ser avaliados
        const openSet = new Set([start]);
        
        // Para cada nó, qual nó veio antes dele no caminho mais eficiente
        const cameFrom = new Map();
        
        // Para cada nó, o custo do caminho mais barato do início até o nó
        const gScore = new Map();
        gScore.set(start, 0);
        
        // Para cada nó, o custo total estimado do caminho através do nó até o objetivo
        const fScore = new Map();
        fScore.set(start, this.heuristic(start, goal));
        
        while (openSet.size > 0) {
            // Encontrar o nó em openSet com o menor fScore
            let current = this.getLowestFScore(openSet, fScore);
            
            // Se chegamos ao objetivo, reconstruir e retornar o caminho
            if (current === goal) {
                return this.reconstructPath(cameFrom, current);
            }
            
            // Remover o nó atual do conjunto aberto e adicionar ao conjunto fechado
            openSet.delete(current);
            closedSet.add(current);
            
            // Para cada vizinho do nó atual
            for (const neighbor of this.getNeighbors(current)) {
                // Ignorar vizinhos que já foram avaliados
                if (closedSet.has(neighbor)) {
                    continue;
                }
                
                // Descobrir um novo nó
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
                
                // Calcular o gScore tentativo
                const tentativeGScore = gScore.get(current) + this.distance(current, neighbor);
                
                // Este caminho para o vizinho é pior que um já encontrado
                if (gScore.has(neighbor) && tentativeGScore >= gScore.get(neighbor)) {
                    continue;
                }
                
                // Este é o melhor caminho até agora, registrar
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, gScore.get(neighbor) + this.heuristic(neighbor, goal));
            }
        }
        
        // Se chegamos aqui, não há caminho
        return null;
    }
    
    // Função heurística: distância em linha reta (euclidiana) entre dois pontos
    heuristic(a, b) {
        return calculateDistance(a.lat, a.lng, b.lat, b.lng);
    }
    
    // Obter o nó com o menor fScore do conjunto aberto
    getLowestFScore(openSet, fScore) {
        let lowest = null;
        let lowestScore = Infinity;
        
        for (const node of openSet) {
            const score = fScore.get(node) || Infinity;
            if (score < lowestScore) {
                lowest = node;
                lowestScore = score;
            }
        }
        
        return lowest;
    }
    
    // Obter vizinhos de um nó no grafo
    getNeighbors(node) {
        return this.graph[node.id] || [];
    }
    
    // Calcular distância entre dois nós
    distance(a, b) {
        return calculateDistance(a.lat, a.lng, b.lat, b.lng);
    }
    
    // Reconstruir o caminho a partir do mapa cameFrom
    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath.unshift(current);
        }
        
        return totalPath;
    }
}

// Função para criar um grafo a partir de uma lista de pontos e conexões
function createGraph(points, connections) {
    const graph = {};
    
    // Inicializar o grafo com todos os pontos
    points.forEach(point => {
        graph[point.id] = [];
    });
    
    // Adicionar conexões ao grafo
    connections.forEach(conn => {
        const [from, to, distance] = conn;
        
        // Grafo não direcionado (bidirecional)
        graph[from].push({id: to, distance});
        graph[to].push({id: from, distance});
    });
    
    return graph;
}

// Função para converter rota do Leaflet em formato para o algoritmo A*
function convertLeafletRouteToGraph(route) {
    const points = [];
    const connections = [];
    
    // Extrair pontos da rota
    route.forEach((point, index) => {
        points.push({
            id: `p${index}`,
            lat: point.lat,
            lng: point.lng
        });
        
        // Criar conexões entre pontos consecutivos
        if (index > 0) {
            const distance = calculateDistance(
                points[index-1].lat, points[index-1].lng,
                point.lat, point.lng
            );
            connections.push([`p${index-1}`, `p${index}`, distance]);
        }
    });
    
    return { points, connections };
}

// Função para encontrar o caminho mais curto entre dois pontos usando A*
function findShortestPath(startPoint, endPoint, graph) {
    const astar = new AStar(graph);
    return astar.findPath(startPoint, endPoint);
}

// Função para otimizar rota para passar por todos os pontos sem repetir ruas
function optimizeRouteWithoutRepeatingStreets(startPoint, endPoint, waypoints) {
    // Implementação simplificada do problema do carteiro chinês
    // Esta é uma versão básica que tenta encontrar um caminho euleriano
    
    // Criar grafo com todos os pontos
    const allPoints = [startPoint, ...waypoints, endPoint];
    const graph = createCompleteGraph(allPoints);
    
    // Encontrar um ciclo euleriano (ou caminho euleriano se não for possível um ciclo)
    const path = findEulerianPath(graph, startPoint, endPoint);
    
    return path;
}

// Criar um grafo completo onde cada nó está conectado a todos os outros
function createCompleteGraph(points) {
    const graph = {};
    
    // Inicializar o grafo com todos os pontos
    points.forEach((point, i) => {
        point.id = `p${i}`;
        graph[point.id] = [];
    });
    
    // Conectar cada ponto a todos os outros
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const distance = calculateDistance(
                    points[i].lat, points[i].lng,
                    points[j].lat, points[j].lng
                );
                
                graph[points[i].id].push({
                    id: points[j].id,
                    node: points[j],
                    distance
                });
            }
        }
    }
    
    return graph;
}

// Encontrar um caminho euleriano no grafo
function findEulerianPath(graph, start, end) {
    // Implementação simplificada usando o algoritmo de Hierholzer
    // Para um grafo completo, qualquer caminho que visita cada nó exatamente uma vez é válido
    
    const visited = new Set();
    const path = [];
    
    // Começar pelo ponto inicial
    let current = start;
    path.push(current);
    visited.add(current.id);
    
    // Visitar todos os pontos intermediários
    while (visited.size < Object.keys(graph).length - 1) {
        // Encontrar o vizinho mais próximo não visitado
        let closestNeighbor = null;
        let minDistance = Infinity;
        
        for (const neighbor of graph[current.id]) {
            if (!visited.has(neighbor.id) && neighbor.id !== end.id && neighbor.distance < minDistance) {
                closestNeighbor = neighbor.node;
                minDistance = neighbor.distance;
            }
        }
        
        if (closestNeighbor) {
            current = closestNeighbor;
            path.push(current);
            visited.add(current.id);
        } else {
            // Se não houver vizinhos não visitados, ir para o ponto final
            break;
        }
    }
    
    // Adicionar o ponto final
    path.push(end);
    
    return path;
}
