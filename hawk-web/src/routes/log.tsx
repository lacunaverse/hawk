import { Nav } from '../components/layouts/Nav';
import '../main.css';

export const Log = () => {
	document.title = 'Log';
	return (
		<div>
			<div className="main">
				<Nav />
			</div>
		</div>
	)
}