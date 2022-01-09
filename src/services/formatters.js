import { CURRENCY_LIST } from '@services/currencies';

function formatNumber(number, groupSep, decimalSep, fractionSize) {
    const lgroup = 3;
    const group = 3;

    const pow = 10 ** fractionSize;
    const newNumber = Math.abs(number) / pow;
    let fraction = newNumber.toString().split('.');
    const whole = fraction[0];
    fraction = fraction[1] || '';

    let pos = 0;
    let formatedText = '';
    if (whole.length >= lgroup + group) {
        pos = whole.length - lgroup;
        for (let i = 0; i < pos; i += 1) {
            if ((pos - i) % group === 0 && i !== 0) {
                formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
        }
    }

    for (let i = pos; i < whole.length; i += 1) {
        if ((whole.length - i) % lgroup === 0 && i !== 0) {
            formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
    }

    while (fraction.length < fractionSize) {
        fraction += '0';
    }

    if (fractionSize && fractionSize !== '0') {
        formatedText += decimalSep + fraction.substr(0, fractionSize);
    }

    return formatedText;
}

export function formatBTOnlyNumber(saldo, tipo) {
    if (saldo == null) {
        return '';
    }

    let signo;
    if (saldo.codigo) {
        signo = saldo.codigo.charAt(0);
    } else {
        signo = saldo.charAt(0);
    }

    if (signo !== '+' && signo !== '-') {
        return `${saldo}0`;
    }

    const numDecimales = 7;
    const separaMiles = tipo === 'sajon' ? ',' : '.';
    const separaDecimales = tipo === 'sajon' ? '.' : ',';
    const num = parseInt(saldo, 10);
    const parts = [];
    signo = num >= 0 ? '+' : '-';

    // Check for invalid nums
    let out = Number.isNaN(num) || num === '' || num === null || !Number.isFinite(num) ? '' : num;

    out = formatNumber(out, separaMiles, separaDecimales, numDecimales);

    // Se dejan solo 2 decimales
    out = out.slice(0, out.lastIndexOf(',') + 3);

    parts.push(signo === '-' ? signo : '');
    parts.push(out);
    return parts.join('');
}

function incluirSeparadorDeMiles(importe) {
    let digitsCount = 0;
    let finalValue = '';
    const values = importe.split('').reverse();
    values.forEach((strValue) => {
        finalValue += strValue;
        digitsCount += 1;
        if (digitsCount % 3 === 0) {
            finalValue += '.';
        }
    });

    finalValue = finalValue.split('').reverse().join('');
    finalValue = finalValue.replace(/^\.(.*)$/, '$1');
    return finalValue;
}

function formatImporte(_importe, decimales, moneda, listaDivisas) {
    const importe = _importe.toString();
    const importeEntero = importe.substring(0, importe.length - parseInt(decimales, 10));
    const importeDecimal = importe.substring(importe.length - parseInt(decimales, 10));
    const importeEnteroConSeparadorDeMiles = incluirSeparadorDeMiles(importeEntero);
    let { nombreCorto } = listaDivisas.find((divisa) => divisa.codigoInternoDivisa === parseInt(moneda, 10));
    nombreCorto = CURRENCY_LIST[nombreCorto].symbol || nombreCorto;

    return { importe: `${importeEnteroConSeparadorDeMiles},${importeDecimal}`, moneda: nombreCorto };
}

/* formatImporte
 * @params data: Puede llegarnos una de las tres formas:
 * "+00000000010000028112"
 * { "importeComoLong": 10000, "numeroDecimales": 2, "codigo": "+00000000010000028112", "moneda": { "codigoMoneda": "281", ... } }
 * { "importeConSigno": 10000, "numeroDecimalesImporte": 2, "moneda": { "divisa": "281", ... } }
 * @returns { importe: "1.000.00", moneda: "€"}
 */
export function formatImporteMonetario(data, listaDivisas) {
    if (!data) {
        return { importe: '', moneda: '' };
    }
    if (data.importeComoLong) {
        return formatImporte(data.importeComoLong, data.numeroDecimales, data.moneda.codigoMoneda, listaDivisas);
    }

    if (data.importeConSigno) {
        return formatImporte(data.importeConSigno, parseInt(data.numeroDecimalesImporte, 10), data.moneda.divisa, listaDivisas);
    }

    const importe = parseInt(data.substring(1, 16), 10);
    const decimales = data.substring(20);
    const moneda = data.substring(16, 19);
    return formatImporte(importe, parseInt(decimales, 10), parseInt(moneda, 10), listaDivisas);
}

export function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
