import { Nav } from '../../components/layouts/Nav';
import '../../main.css';
import { SecondaryNav } from './Nav';

export const View = () => {
    document.title = 'View';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
        </div>
    );
};
