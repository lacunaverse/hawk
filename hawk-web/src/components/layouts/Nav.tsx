import './Nav.css';
import { Link } from 'inferno-router';

export const Nav = () => {
    return (
        <div className="nav">
            <Link to="/">Home</Link>
            <Link to="/view">View</Link>
            <Link to="/log">Log</Link>
            <Link to="/metrics/new">New Metric</Link>
            <Link to="/search">Search</Link>
            <Link to="/export">Export</Link>
            <Link to="/about">About</Link>
        </div>
    );
};
