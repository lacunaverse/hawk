import { Nav } from '../../components/layouts/Nav';
import '../../main.css';
import { SecondaryNav } from './Nav';

export const Compare = () => {
    document.title = 'Compare Stats';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
        </div>
    );
};