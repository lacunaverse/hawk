import { Nav } from '../../components/layouts/Nav';
import '../../main.css';
import { SecondaryNav } from './Nav';

export const EditMetrics = () => {
    document.title = 'Edit Metrics';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
        </div>
    );
};
