import { useEffect, useState } from "react";

export default function Table() {
  // Estado de la matriz y funcióna para actualizarlo
  const [matriz, setMatriz] = useState([
    // Matriz que representa al laberinto
    /*
      -1: Camino recorrido
      0: Pared
      1: Camino libre
      2: Inicio
      3: Salida
    */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
    [0, 2, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // Variables que controla el boton para inicializar el algoritmo
  const [start, setStart] = useState(false);
  // Función que se encarga de ejecutar el codigo en React
  useEffect(() => {
    console.time("Inicio");
    // Función para encontrar el camino más corto desde (x, y) hasta el destino
    async function findShortestPath(x, y) {
      // Verifica límites y marca las direcciones (arriba, derecha, abajo, izquierda)
      if (x < 0 || x >= matriz.length || y < 0 || y >= matriz[0].length) {
        return [];
      }

      // Coordenadas de las direcciones (arriba, derecha, abajo, izquierda)
      const dx = [-1, 0, 1, 0];
      const dy = [0, 1, 0, -1];

      // Matriz para rastrear las celdas visitadas
      const visited = Array(matriz.length)
        .fill()
        .map(() => Array(matriz[0].length).fill(false));

      // Cola para realizar el BFS
      const queue = [{ x, y, path: [] }];

      while (queue.length > 0) {
        const current = queue.shift();
        const newX = current.x;
        const newY = current.y;
        const currentPath = [...current.path, { x: newX, y: newY }];

        visited[newX][newY] = true;

        // Si encontramos la salida, regresamos el camino
        if (matriz[newX][newY] === 3) {
          return currentPath;
        }

        // Exploramos las celdas adyacentes en las 4 direcciones
        for (let dir = 0; dir < 4; dir++) {
          const nextX = newX + dx[dir];
          const nextY = newY + dy[dir];

          // Verificar límites y evitar celdas bloqueadas
          if (
            nextX >= 0 &&
            nextX < matriz.length &&
            nextY >= 0 &&
            nextY < matriz[0].length &&
            !visited[nextX][nextY] &&
            matriz[nextX][nextY] !== 0
          ) {
            queue.push({ x: nextX, y: nextY, path: currentPath });
          }
        }
      }

      // Si no se encuentra un camino, se devuelve un camino vacío
      return [];
    }

    // Función para pintar el camino en la interfaz
    async function paintPath(path) {
      for (const { x, y } of path) {
        // Marcar la celda como visitada y actualizar la matriz
        matriz[x][y] = -1;
        setMatriz([...matriz]);

        // Agregar un retraso para crear una animación de búsqueda
        await sleep(150); // Agrega un retraso de 300 ms (0.3 segundos)
      }
    }

    // Encontrar las coordenadas de la celda de inicio
    let startX, startY;
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] === 2) {
          startX = i;
          startY = j;
          break;
        }
      }
    }

    // Iniciar la búsqueda cuando se presiona el botón "Iniciar búsqueda"
    if (start) {
      // Encontrar el camino más corto
      findShortestPath(startX, startY).then((shortestPath) => {
        // Pintar el camino en la interfaz
        paintPath(shortestPath).then(() => {
          // Mostrar un mensaje al llegar al destino
          console.timeEnd("Inicio");
          setTimeout(() => {
            alert("Llegaste a la meta!!");
          }, 200);
        });
      });
    }
  }, [matriz, start]);

  // Función para agregar un retraso en la animación
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //Diseño colores que se le asignaran a x numero
  function Condicionales(valor) {
    switch (valor) {
      case -1:
        return "bg-pink-600"; // Celda visitada
      case 1:
        return "bg-yellow-200"; // Celda libre
      case 2:
        return "bg-red-500"; // Celda de inicio
      case 3:
        return "bg-green-500"; // Celda de destino
      default:
        return "text-white bg-black"; // Otros valores (celdas bloqueadas)
    }
  }
  return (
    <>
      {/* Botón para iniciar la búsqueda */}
      <div className="bg-black h-screen w-full text-center">
        <h1 className="text-3xl font-semibold text-white py-2">
          Laberinto BFS
        </h1>
        <div className="mx-auto flex h-5/6 w-5/6 items-center justify-center rounded-xl shadow-2xl bg-emerald-600 p-4">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {matriz.map((fila) =>
              fila.map((valor, rowIndex) => (
                <span
                  key={rowIndex}
                  className={`col-span-1 row-span-1 transition-all ${Condicionales(
                    valor
                  )}`}
                >
                  ‎
                </span>
              ))
            )}
          </div>
        </div>
        <button
          className=" my-2 py-2 px-4 text-white rounded-md shadow-md bg-pink-600"
          onClick={() => setStart(!start)}
        >
          Iniciar Búsqueda
        </button>
      </div>
    </>
  );
}
