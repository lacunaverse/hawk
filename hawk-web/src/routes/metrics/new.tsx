import { Component } from 'inferno';

import { Nav } from '../../components/layouts/Nav';
import { SecondaryNav } from './Nav';

import '../../main.css';
import '../../components/styles/forms.css';

export const NewMetric = () => {
    document.title = 'New Metric';
    return (
        <div className="main">
            <Nav />
            <SecondaryNav />
            <Form />
        </div>
    );
};

enum Frequency {
    Hourly,
    Daily,
    Weekly,
    BiWeekly,
    Monthly,
    BiMonthly,
    Yearly,
    Custom,
}

enum ValueType {
    String,
    Number,
    Date,
    Boolean,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            error: '',
            frequency: Frequency,
            valueType: ValueType,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFrequencyChange = this.handleFrequencyChange.bind(this);
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        fetch(`/metrics/new`, {
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

    handleFrequencyChange(event) {
        let frequency: Frequency;
        switch (event.target.value) {
            case 'hourly':
                frequency = Frequency.Hourly;
                break;
            case 'daily':
                frequency = Frequency.Daily;
                break;
            case 'weekly':
                frequency = Frequency.Weekly;
                break;
            case 'biweekly':
                frequency = Frequency.BiWeekly;
                break;
            case 'monthly':
                frequency = Frequency.Monthly;
                break;
            case 'bimonthly':
                frequency = Frequency.BiMonthly;
                break;
            case 'yearly':
                frequency = Frequency.Yearly;
                break;
            case 'custom':
                frequency = Frequency.Custom;
                break;
            default:
                this.setState({ error: 'Invalid frequency' });
        }

        if (frequency) {
            this.setState({ frequency });
        } else {
            this.setState({ error: 'Invalid frequency' });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>New Metric</legend>
                    <div>
                        <label for="name">Name</label>
                        <input type="text" value={this.state.name} onInput={this.handleChange} />
                    </div>
                    <div>
                        <label for="frequency">Frequency</label>
                        <select id="frequency" onChange={this.handleFrequencyChange}>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="bimonthly">Bimonthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                    <input type="submit" value="Create" />
                </fieldset>
                {this.state.error ? <p>{this.state.error}</p> : ''}
            </form>
        );
    }
}
