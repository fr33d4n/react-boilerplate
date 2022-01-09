import Home from '@pages/Home/Home';
import CompleteDocumentation from '@pages/CompleteDocumentation/CompleteDocumentation';
import Tarjetas from '@pages/Tarjetas/Tarjetas';
import Demo from '@pages/Demo/Demo';
import ErrorC from '@pages/Error/Error';
import Oficina from '@pages/Oficina/Oficina';
import Mifid from '@pages/Mifid/Mifid';
import ContratacionFinalizada from '@pages/ContratacionFinalizada/ContratacionFinalizada';
import PAGE_ROUTES from './routes';

export default [
    { exact: true, path: PAGE_ROUTES.DEMO, component: Demo },
    { path: PAGE_ROUTES.HOME, component: Home },
    { path: PAGE_ROUTES.COMPLETE_DOCUMENTATION, component: CompleteDocumentation },
    { path: PAGE_ROUTES.TARJETAS, component: Tarjetas },
    { path: PAGE_ROUTES.ERROR, component: ErrorC },
    { path: PAGE_ROUTES.OFICINA, component: Oficina },
    { path: PAGE_ROUTES.MIFID, component: Mifid },
    { path: PAGE_ROUTES.CONTRATACION_FINALIZADA, component: ContratacionFinalizada },
];
