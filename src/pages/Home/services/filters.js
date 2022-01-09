const repeatedContracts = (processes) => {
    const auxProcesses = processes;
    const digestedProcesses = processes.map((elem) => {
        let cont = 0;
        const newElement = { ...elem };
        auxProcesses.forEach((elem2) => {
            if (elem.codigoProceso === elem2.codigoProceso) {
                cont += 1;
            }
        });
        if (cont > 1) {
            newElement.mostrarContrato = true;
        } else {
            newElement.mostrarContrato = false;
        }
        return {
            ...newElement,
        };
    });
    return digestedProcesses;
};

const checkCardIsValid = (aviso, contratos) => {
    const localAviso = aviso;
    const avisoValido = [];
    const startCard = aviso.idExpediente.slice(0, 4);
    const endCard = aviso.idExpediente.slice(15);
    const contratoValido = contratos.find(contrato => {
        const idContract = contrato.identificadorContratoProducto;
        const idContratoS = idContract.substring(idContract.length-16, idContract.length);
        const startContrato = idContratoS.slice(0, 4);
        const endContrato = idContratoS.slice(12)

        return startContrato === startCard && endContrato === endCard
    });
    if(contratoValido){
        localAviso.aviso.contratoTarjeta = contratoValido;
        avisoValido.push(aviso);
      }
    return avisoValido;
}

export const processAvisos = (avisos, contratos)=>{
    const existingAviso = [];
    const avisosNoOp = avisos.filter((a) => a.naturalezaEvento !== 'OP');
    const avisosOp = avisos.filter((a) => a.naturalezaEvento === 'OP');
    avisosNoOp.forEach(aviso => {
        if(aviso.aviso.id.includes("EV0000000060")){
            const avisoConContrato = checkCardIsValid(aviso, contratos);
            if(avisoConContrato.length === 1){
                existingAviso.push(avisoConContrato[0]);
            }
        } else {
            existingAviso.push(aviso);
        }
    });
    return avisosOp.concat(existingAviso);
}

export default repeatedContracts;
