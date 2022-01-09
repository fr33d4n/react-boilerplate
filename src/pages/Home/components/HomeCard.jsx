import React from 'react';
import PropTypes from 'prop-types';
import IntervinientesCard from './CardIntervinientes';
import DocPendienteCard from './CardDocPendiente';
import AvisosOpCard from './CardAvisosOp';
import AvisosNoOpCard from './CardAvisosNoOp';

const CARD_TYPES = {
    DOC_PENDIENTE: 'DOC_PENDIENTE',
    INTERVINIENTES_PENDIENTES: 'INTERVINIENTES_PENDIENTES',
    AVISOS_OP: 'AVISOS_OP',
    AVISOS_NO_OP: 'AVISOS_NO_OP',
};

function getCardType(cardInfo) {
    if (cardInfo.documentacionCompleta == null) {
        if (cardInfo.naturalezaEvento === 'OP') {
            return CARD_TYPES.AVISOS_OP;
        }
        return CARD_TYPES.AVISOS_NO_OP;
    }

    if (cardInfo.documentacionCompleta === false || (cardInfo.url && cardInfo.url !== '' && !cardInfo.respuestaCon.esRedireccionABDT)) {
        return CARD_TYPES.DOC_PENDIENTE;
    }
    if (cardInfo.documentacionCompleta === true && !(cardInfo.url && cardInfo.url !== '' && !cardInfo.respuestaCon.esRedireccionABDT)) {
        return CARD_TYPES.INTERVINIENTES_PENDIENTES;
    }
}

function HomeCard({ card }) {
    const cardType = getCardType(card);
    switch (cardType) {
        case CARD_TYPES.DOC_PENDIENTE:
            return <DocPendienteCard process={card} />;
        case CARD_TYPES.INTERVINIENTES_PENDIENTES:
            return <IntervinientesCard process={card} />;
        case CARD_TYPES.AVISOS_OP:
            return <AvisosOpCard warning={card} />;
        case CARD_TYPES.AVISOS_NO_OP:
            return <AvisosNoOpCard warning={card} />;
        default:
            return <p>No card</p>;
        // noop
    }
}

HomeCard.propTypes = {
    /* eslint-disable-next-line react/forbid-prop-types */
    card: PropTypes.object.isRequired,
};

export default HomeCard;
