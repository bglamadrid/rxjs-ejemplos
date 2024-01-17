const { concat, of } = require('rxjs');
const { takeUntil, tap, ignoreElements, filter } = require('rxjs/operators');
const EJEMPLOS = require('./lib');

// refactorizacion de sintaxis repetitiva
const concluirRedactando = (mensaje) => tap({ complete: () => console.log(mensaje) });
const hastaPresionarUnaTecla = () => takeUntil(EJEMPLOS.alPresionarUnaTecla());

concat(
    of().pipe(
        concluirRedactando('EJEMPLO 1 "Reloj 60 segundos"')
    ),
    EJEMPLOS.cuentaSegundosHasta(10).pipe(
        hastaPresionarUnaTecla(),
        concluirRedactando('EJEMPLO 1 "Cuenta segundos" terminado'),
        concluirRedactando('EJEMPLO 2 "Cronometro personalizado"')
    ),
    EJEMPLOS.cronometroPersonalizable({
        limiteConteo: 7,
        intervaloActualizacionMs: 1350,
        tipoPlantilla: 'difusa'
    }).pipe(
        hastaPresionarUnaTecla(),
        concluirRedactando('EJEMPLO 2 "Cronometro personalizado" terminado'),
        concluirRedactando('EJEMPLO 3 "Semaforo"')
    ),
    // EJEMPLOS.conversionHorariaDesdeApi().pipe(
    //     takeLast(1),
    //     concluirRedactando('EJEMPLO 2 "Conversion horaria desde API" terminado')
    // ),
    EJEMPLOS.semaforo().pipe(
        hastaPresionarUnaTecla(),
        concluirRedactando('EJEMPLO 3 "Semaforo" terminado')
    )
).pipe(
    filter(data => !!data),
    tap((data) => console.log(data)),
    concluirRedactando('FIN'),
    ignoreElements()
).subscribe();
