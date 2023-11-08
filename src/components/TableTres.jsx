// Importamos los recursos que vamos a utilizar en el algoritmo
import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";

export default function TableTres() {
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // Variables que controla el boton para inicializar el algoritmo
  const [start, setStart] = useState(false);

  const [stylePop, SetStylePop] = useState({
    display: "hidden",
    opacity: "opacity-0",
  });
  // Función que se encarga de ejecutar el codigo en React
  const inicio = Date.now();
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    const canvas = document.getElementById("laberinto");

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
        await sleep(150); // Agrega un retraso de 150 ms (0.15 segundos)
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
          // Muestra un mensaje al llegar al destino y muestra cuanto se tardo el algoritmo
          const end = Date.now();
          const tiempo = end - inicio;

          console.log(`Tiempo de ejecución: ${tiempo} ms`);
          setTimeout(() => {
            jsConfetti.addConfetti({
              emojis: 500,
              emojiSize: 100,
              confettiNumber: 500,
            });
            SetStylePop({ display: "flex", opacity: "opacity-100" });
          }, 200);
        });
      });
    }
  }, [matriz, start]);

  // Función para agregar un retraso en la animación
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //colores que se le asignaran a cada valor para representarlo visualmente con Tailwind
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
    <main>
      <article className="bg-black h-screen w-full text-center">
        <h1 className="text-3xl font-semibold text-white py-2">
          Laberinto BFS
        </h1>
        <div
          className="mx-auto flex h-5/6 w-4/6 items-center justify-center rounded-xl shadow-2xl bg-emerald-600 p-4"
          id="laberinto"
        >
          {/* Aca se visualiza todo */}
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
        <div
          className={`h-screen w-screen ${stylePop.display} ${stylePop.opacity} transition-opacity backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center items-center text-white font-bold text-2xl`}
        >
          <div className="backdrop-blur-xl flex h-96 w-96 flex-col rounded-xl rounded-t-2xl bg-white shadow-[rgba(0,_0,_0,_0.4)_0px_00px_90px_5px] shadow-purple-800/50">
            <div className="z-10 flex h-16 w-full items-center justify-center rounded-t-xl bg-purple-800 shadow-lg">
              <h2 className="">Encontro el final</h2>
            </div>
            <div className="flex grow items-center justify-center bg-slate-100">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 fill-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3.5em"
                  viewBox="0 0 448 512"
                >
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
              </div>
            </div>
            <div className="z-10 flex h-16 w-full items-center justify-center rounded-b-xl gap-5 bg-purple-800 shadow-lg text-lg">
              <a href="/tablesTres" className="">
                Reintentar
              </a>
              <a href="/" className="">
                Siguiente
              </a>
            </div>
          </div>
        </div>
        <button
          className=" mt-2 py-2 px-4 text-white rounded-md shadow-md bg-pink-600"
          onClick={() => setStart(!start)}
        >
          Iniciar Búsqueda
        </button>
      </article>
    </main>
  );
}
