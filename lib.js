const { interval, Observable, of, concat } = require('rxjs');
const { ajax } = require('rxjs/ajax');
const { tap, takeWhile, delay, repeat, map } = require('rxjs/operators');

/**
 * Observable de cuenta simple.
 */
function cuentaSegundosHasta(z) {
    return interval(1000).pipe(
        takeWhile(x => (x < z)),
        map(x => {
            const esSingular = x === 1;
            return esSingular ? 'Ha pasado 1 segundo' : `Han pasado ${x} segundos`;
        })
    );
}

/**
 * Observable de cuenta con opciones extendidas.
 * Su unico parametro es un objeto que debe contener estas propiedades:
 *
 * - `limiteConteo`: `number` debe ser mayor a 0
 * - `intervaloActualizacionMs`: `number` debe ser mayor a 0
 * - `tipoPlantilla`: `difusa` | `lcd`
 */
function cronometroPersonalizable({ limiteConteo, intervaloActualizacionMs, tipoPlantilla }) {
    const rellenarFn = (n) => (n < 9 ? `0${n}` : n);
    const plantillaFn = {
        'difusa': (x) => (x.esSingular ? 'Ha pasado 1 segundo' : `Han pasado ${x.totalDecimasSegundos / 10} segundos`),
        'lcd': (x) => {
            const totalSegundos = Math.floor(x.totalDecimasSegundos / 10);
            const horas = Math.floor(totalSegundos / 3600);
            const minutos = Math.max((Math.floor(totalSegundos / 60) - (horas * 60)), 0);
            const segundos = Math.max((totalSegundos - (minutos * 60) - (horas * 3600)), 0);
            const decimas = Math.max((x.totalDecimasSegundos - (minutos * 60) - (horas * 3600)), 0);
            return `${rellenarFn(horas)}:${rellenarFn(minutos)}:${rellenarFn(segundos)}:${decimas}`;
        }
    }[tipoPlantilla];
    return interval(intervaloActualizacionMs).pipe(
        takeWhile(x => (x < limiteConteo)),
        map(x => (intervaloActualizacionMs * x)),
        map(tiempoTotalMs => Math.round(tiempoTotalMs / 100)),
        map(totalDecimasSegundos => ({
            totalDecimasSegundos,
            esSingular: totalDecimasSegundos === 10
        })),
        map(x => plantillaFn(x))
    );
}

function semaforo() {
    const rojo$ = of('rojo');
    const verde$ = of('verde');
    const amarillo$ = of('amarillo');
    const escalaTiempo = 0.1;
    return concat(
        verde$,
        concat(
            amarillo$.pipe(delay(20000 * escalaTiempo)),
            rojo$.pipe(delay(5000 * escalaTiempo)),
            verde$.pipe(delay(20000 * escalaTiempo))
        ).pipe(
            repeat()
        )
    ).pipe(
        map(nombreColor => ({
            'verde': '🟩',
            'amarillo': '🟨',
            'rojo': '🟥'
        })[nombreColor])
    );
}

/**
 * Re-implementacion de Streams HTTP con Observable
 */
function conversionHorariaDesdeApi() {
    const url = `https://raw.githubusercontent.com/bglamadrid/bglamadrid/main/README.md`;
    return ajax.get(url).pipe(
        tap(() => console.log(url)),
        tap(console.log)
    );
}

/** Usando Callbacks desde un par Observable y Observer */
function alPresionarUnaTecla() {
    return new Observable((observer) => {
        let eventoInvocado = false;
        process.stdin.setRawMode(true);
        process.stdin.once('data', () => {
            if (!eventoInvocado) {
                process.stdin.setRawMode(false);
                eventoInvocado = true;
                observer.next();
                observer.complete();
            }
        });
        return {
            unsubscribe() {
                eventoInvocado = true;
                process.stdin.setRawMode(false);
            }
        };
    });
}

module.exports = {
    cuentaHasta,
    conversionHorariaDesdeApi,
    alPresionarUnaTecla,
    semaforo
};
