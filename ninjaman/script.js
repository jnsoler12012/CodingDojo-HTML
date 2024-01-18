var mundo = document.querySelector("#mapa");
var mapa = [
    [0, 0, 0, 0, 0],
    [0, 1, 2, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 2, 0, 1, 0],
    [0, 1, 1, 2, 0],
    [0, 0, 0, 0, 0]
];

function dibujarMapa(mundoArray) {
    var string = "";
    var diccionario = {
        0: "wall",
        1: "blank",
        2: "sushi",
        3: "onigiri"
    };
    for (i = 0; i < mundoArray.length; i++) {
        string += "<div class='row'>";
        for (j = 0; j < mundoArray[i].length; j++) {
            var cell = mundoArray[i][j];
            string += "<div class='" + diccionario[cell] + "'></div>";
        }
        string += "</div>";
    }
    mundo.innerHTML = string;
    mapa = mundoArray;
}

function crearMundo(rows, columns) {
    var mundoArray = [];

    for (i = 0; i < rows; i++) {
        mundoArray.push([]);
        for (j = 0; j < columns; j++) {
            if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
                mundoArray[i].push(0);
            } else {
                var random = Math.floor(Math.random() * rows * columns);
                if (random < .01 * rows * columns) {
                    mundoArray[i].push(3);
                }
                else if (random === .01 * rows * columns) {
                    mundoArray[i].push(2);
                }
                else if (random > rows * columns - .1 * rows * columns) {
                    mundoArray[i].push(0);
                }
                else {
                    mundoArray[i].push(1);
                }
            }
        }
    }
    mundoArray[1][1] = 1;
    mundoArray[rows - 2][columns - 2] = 1;
    dibujarMapa(mundoArray);

}

var ninjaman = {
    left: 1,
    top: 1
};

var fantasma = {
    left: 18,
    top: 18
};

function crearNinjaman() {
    document.getElementById("ninjaman").style.left = ninjaman.left * 40 + "px";
    document.getElementById("ninjaman").style.top = ninjaman.top * 40 + 40 + "px";
    comer(mapa[ninjaman.top][ninjaman.left])
}

function crearFantasma() {
    document.getElementById("fantasma").style.left = fantasma.left * 40 + "px";
    document.getElementById("fantasma").style.top = (fantasma.top * 40 + 40) + "px";
}

function comer(localizacion) {
    var puntaje = Number(document.querySelector("#puntaje").textContent);
    switch (localizacion) {
        case 2:
            puntaje += 10;
            break;
        case 3:
            puntaje += 5;
            break;
    }
    document.querySelector("#puntaje").textContent = puntaje;
    mapa[ninjaman.top][ninjaman.left] = 1;
    dibujarMapa(mapa);
}

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            if (mapa[ninjaman.top][ninjaman.left - 1] !== 0) {
                ninjaman.left--;
            }
            break;
        case 39:
            if (mapa[ninjaman.top][ninjaman.left + 1] !== 0) {
                ninjaman.left++;
            }
            break;
        case 38:
            if (mapa[ninjaman.top - 1][ninjaman.left] !== 0) {
                ninjaman.top--;
            }
            break;
        case 40:
            if (mapa[ninjaman.top + 1][ninjaman.left] !== 0) {
                ninjaman.top++;
            }
            break;
    }
    crearNinjaman();
};

function moverFantasma() {
    var direcciones = [[fantasma.top, fantasma.left + 1], [fantasma.top, fantasma.left - 1], [fantasma.top + 1, fantasma.left], [fantasma.top - 1, fantasma.left]];
    movimientos = [];
    altMovimientos = [];
    var nl = ninjaman.left
    var nt = ninjaman.top;
    var bl = fantasma.left;
    var bt = fantasma.top;
    var distanciaActual = Math.sqrt(Math.pow(nl - bl, 2) + Math.pow(nt - bt, 2));


    direcciones.forEach(function (move) {
        var nuevaDistancia = Math.sqrt(Math.pow(nl - move[1], 2) + Math.pow(nt - move[0], 2));
        if (mapa[move[0]][move[1]] !== 0) {
            if (nuevaDistancia < distanciaActual) {
                movimientos.push(move);
            }
            else {
                altMovimientos.push(move);
            }
        }
    });
    if (movimientos.length > 0) {
        var random = Math.floor(Math.random() * movimientos.length);
        var choice = movimientos[random];
        fantasma.top = choice[0];
        fantasma.left = choice[1];
    }
    else {
        var random = Math.floor(Math.random() * altMovimientos.length);
        var choice = altMovimientos[random];
        fantasma.top = choice[0];
        fantasma.left = choice[1];
    }
    crearFantasma();
    revisarMuerte();
}

function nuevoJuego() {
    crearMundo(20, 20);
    pararFantasma = setInterval(moverFantasma, 250);
    pararComida = setInterval(crearComida, 2000)
    fantasma.left = 18;
    fantasma.top = 18;
    ninjaman.left = 1;
    ninjaman.top = 1;
    crearNinjaman();
    crearFantasma();
}

nuevoJuego();

function crearComida() {
    var row = 0;
    var column = 0;
    while (mapa[row][column] !== 1) {
        row = Math.floor(Math.random() * mapa.length);
        column = Math.floor(Math.random() * mapa[0].length);
    }
    var random = (Math.floor(Math.random() * 100))
    if (random < 9) {
        mapa[row][column] = 2;
    }
    else {
        mapa[row][column] = 3;
    }
    dibujarMapa(mapa);
}

function revisarMuerte() {
    if (fantasma.top === ninjaman.top && fantasma.left === ninjaman.left) {
        clearInterval(pararFantasma);
        clearInterval(pararComida);
        var vidas = document.querySelector("#vidas");
        vidas.textContent = Number(vidas.textContent - 1);
        if (Number(vidas.textContent) > 0) {
            alert("Perdiste...")
            nuevoJuego();
        }
        else {
            var puntaje = document.querySelector("#puntaje");
            alert("Fin del juego - Puntaje total: " + puntaje.textContent);
            puntaje.textContent = 0;
            vidas.textContent = 3;
            nuevoJuego();
        }
    }
}