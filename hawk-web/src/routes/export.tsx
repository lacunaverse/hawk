import { Nav } from '../components/layouts/Nav';
import '../main.css';
import '../components/styles/thin.css';
import '../components/styles/forms.css';
import { Component } from 'inferno';

enum ExportType {
    Json = 1,
    Html,
}

export class ExportData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            exportType: ExportType,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleExportTypeChange = this.handleExportTypeChange.bind(this);
    }

    handleSubmit(event) {
        fetch(`/export`, {
            method: 'POST',
            body: JSON.stringify(this.state),
        }).then((resp) => {
            if (resp.ok) {
            } else {
                this.setState({
                    error: 'Something went wrong.',
                });
            }
        });
        //            .catch((error) => this.setState({ error }));
        event.preventDefault();
    }

    handleExportTypeChange(event) {
        let exportType: ExportType;
        switch (event.target.value) {
            case 'html':
                exportType = ExportType.Html;
                break;
            case 'json':
                exportType = ExportType.Json;
                break;
            default:
                this.setState({ error: 'Invalid export type' });
        }

        if (!exportType) {
            this.setState({ error: 'Invalid export type' });
        } else {
            this.setState({ exportType });
        }
    }

    render() {
        document.title = 'Export';
        return (
            <div className="main">
                <Nav />
                <div class="content">
                    <h1>Export Hawk Data</h1>
                    <form onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Export</legend>
                            <div>
                                <label for="file-type">File Type</label>
                                <select id="file-type" onChange={this.handleExportTypeChange}>
                                    <option value="html">HTML (.html)</option>
                                    <option value="json">JSON (.json)</option>
                                </select>
                            </div>
                            <input type="submit" value="Export" />
                        </fieldset>
                        {this.state.error ? <p>{this.state.error}</p> : ''}
                    </form>
                </div>
            </div>
        );
    }
}
