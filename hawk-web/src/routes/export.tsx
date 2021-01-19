import { Nav } from '../components/layouts/Nav';
import '../main.css';

export const ExportData = () => {
	document.title = 'Export';
	return (
		<div>
			<div className="main">
				<Nav />
			</div>
		</div>
	)
}