const { interval, Observable, of, concat } = require('rxjs');
const { ajax } = require('rxjs/ajax');
const { tap, takeWhile, delay, repeat, map } = require('rxjs/operators');

/**
 * Observable simple
 */
function cuentaHasta(z) {
    return interval(1000).pipe(
        takeWhile(x => (x < z)),
        map(x => {
            const esSingular = x === 1;
            return esSingular ? 'Ha pasado 1 segundo' : `Han pasado ${x} segundos`;
        })
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
