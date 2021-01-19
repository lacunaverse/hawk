import { Nav } from '../components/layouts/Nav';
import '../main.css';

export const About = () => {
	document.title = 'About';
	return (
		<div>
			<div className="main">
				<Nav />
			</div>
		</div>
	)
}