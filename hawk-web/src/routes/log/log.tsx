import { Nav } from '../../components/layouts/Nav';
import '../../main.css';
import { SecondaryNav } from './Nav';

export const Log = () => {
    document.title = 'Log';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
        </div>
    );
};
