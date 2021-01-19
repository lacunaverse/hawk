import { Nav } from '../../components/layouts/Nav';
import '../../main.css';

export const NewMetric = () => {
	document.title = 'New Metric';
	return (
		<div>
			<div className="main">
				<Nav />
			</div>
		</div>
	)
}