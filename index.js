const { concat } = require('rxjs');
const { takeUntil, tap, ignoreElements } = require('rxjs/operators');
const EJEMPLOS = require('./lib');


console.log('EJEMPLO 1 "Reloj 60 segundos"');

concat(
    EJEMPLOS.cuentaHasta(30).pipe(
        takeUntil(EJEMPLOS.alPresionarUnaTecla()),
        tap({
            complete: () => {
                console.log('EJEMPLO 1 "Cuenta segundos" terminado');
                console.log('EJEMPLO 2 "Cronometro personalizado"');
            }
        })
    ),
    EJEMPLOS.cronometroPersonalizable({
        limiteConteo: 11,
        intervaloActualizacionMs: 1350,
        tipoPlantilla: 'difusa'
    }).pipe(
        takeUntil(EJEMPLOS.alPresionarUnaTecla()),
        tap({
            complete: () => {
                console.log('EJEMPLO 2 "Cronometro personalizado" terminado');
                console.log('EJEMPLO 3 "Semaforo"');
            }
        })
    ),
    // EJEMPLOS.conversionHorariaDesdeApi().pipe(
    //     takeLast(1),
    //     tap({ complete: () => console.log('EJEMPLO 2 "Conversion horaria desde API" terminado') })
    // ),
    EJEMPLOS.semaforo().pipe(
        takeUntil(EJEMPLOS.alPresionarUnaTecla()),
        tap({ complete: () => console.log('EJEMPLO 3 "Semaforo" terminado') })
    )
).pipe(
    tap({
        next: (data) => console.log(data),
        complete: () => console.log('FIN')
    }),
    ignoreElements()
).subscribe();
