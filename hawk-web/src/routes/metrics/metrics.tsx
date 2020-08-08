import { Nav } from '../../components/layouts/Nav';
import '../../main.css';
import { SecondaryNav } from './Nav';

export const Metrics = () => {
    document.title = 'Metrics';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
        </div>
    );
};
