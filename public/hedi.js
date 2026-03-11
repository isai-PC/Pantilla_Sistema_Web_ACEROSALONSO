const pruebaModelo = () => {

    // variables (puedes cambiarlas)
    let n = 28;
    let m = 13;
    let k = 0.02022;

    let a = 13;
    let b = 0.02022;
    let c = 70;

    let x = 28;
    let y = 13;
    let z = 0.02022;

    // resultados
    const resultado1 = Math.log(n / m) / k;
    const resultado2 = a * Math.exp(b * c);
    const resultado3 = Math.log(x / y) / z;

    // mostrar resultados
    alert(
        "Resultado 1: " + resultado1 + "\n" +
        "Resultado 2: " + resultado2 + "\n" +
        "Resultado 3: " + resultado3
    );

};