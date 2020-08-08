import { Nav } from '../components/layouts/Nav';
import '../main.css';
import '../components/styles/thin.css';

export const About = () => {
    document.title = 'About';
    return (
        <div className="main">
            <Nav />
            <div className="content">
                <h1>About</h1>
                <nav>
                    <a href="https://github.com/EthanJustice/hawk">Source</a>
                    <a href="https://github.com/EthanJustice/hawk/wiki">Wiki</a>
                </nav>
                <p>Hawk is an open-source quantified-self analysis tool.</p>
            </div>
        </div>
    );
};
