import { Component, render, linkEvent } from 'inferno';
import { BrowserRouter, Route, Switch } from 'inferno-router';

import { Nav } from './components/layouts/Nav';

import { View } from './routes/view';
import { Log } from './routes/log';
import { Metrics } from './routes/metrics/metrics';
import { EditMetrics } from './routes/metrics/edit';
import { NewMetric } from './routes/metrics/new';
import { ExportData } from './routes/export';
import { Search } from './routes/search';
import { About } from './routes/about';
import { Settings } from './routes/settings';

import './main.css';

const container = document.getElementById('app');

class Index extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        document.title = 'hawk';
        return (
            <div className="main">
                <Nav />
            </div>
        );
    }
}

class App extends Component<any, any> {
    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        <Switch>
                            <Route exact path="/" component={Index} />
                            <Route path="/view" component={View} />
                            <Route path="/log" component={Log} />
                            <Route exact path="/metrics" component={Metrics} />
                            <Route exact path="/metrics/new" component={NewMetric} />
                            <Route exact path="/metrics/edit" component={EditMetrics} />
                            <Route path="/export" component={ExportData} />
                            <Route path="/search" component={Search} />
                            <Route path="/about" component={About} />
                            <Route path="/settings" component={Settings} />
                        </Switch>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

render(<App />, container);
