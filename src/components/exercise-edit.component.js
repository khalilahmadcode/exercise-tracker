import React, {Component} from 'react'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

class ExercisesEdit extends Component  {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
        
        this.state = {
            username: '', 
            description: '', 
            duration: 0, 
            date: new Date(),
            users: []
        }

    } // constructor


    componentDidMount() {
        // fetch data for this id
        axios.get('http://localhost:5000/exercises/'+this.props.match.params.id)
        .then(response => {
            // Update the state
            this.setState({
                username: response.data.username, 
                description: response.data.description, 
                duration: response.data.duration, 
                date: new Date(response.data.date)
            })
        })
        .catch(error=>console.log(error));

        // Fetch username data for dropdown
        axios.get('http://localhost:5000/users/')
            .then(response => {
                if(response.data.length > 0) {
                    this.setState({
                        users: response.data.map(user => user.username) , 
                        username: response.data[0].username
                    })
                }
            })
            .catch(error=>console.log(error));
    }


    /** UPDATE THE STATE WHEN CHANGES */
    // Username
    onChangeUsername(e) {
        this.setState({
            username: e.target.value,
        })
    }

    // Description
    onChangeDescription(e) {
        this.setState({
            description: e.target.value,
        })
    }

    // Duration
    onChangeDuration(e) {
        this.setState({
            duration: e.target.value,
        })
    }

    // Date
    onChangeDate(date) {
        this.setState({
            date: date,
        })
    }

    // Update exercise
    onSubmit(e) {
        e.preventDefault();

        // get the data from state
        const exercise = {
            username: this.state.username, 
            description: this.state.description, 
            duration: this.state.duration, 
            date: this.state.date
        }

        // pass data to backedn
        axios.post('http://localhost:5000/exercises/update/' + this.props.match.params.id, exercise)
        .then(res => console.log(res.data))
        .catch(error => console.log(error));

        // redirect
        window.location = '/';
    }

    render() {
        return (
            <div className="container py-4">
                <h3>Edit Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="">Username</label>
                        <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        >
                            {this.state.users.map(user => {
                                return (
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                )
                            })}
                        </select>
                    </div> 

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" 
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>

                    <div className="form-group">
                        <label>Duration (in minutes)</label>
                        <input type="text" 
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date &nbsp; &nbsp; </label>
                        <DatePicker
                            className="form-control"
                            selected = {this.state.date}
                            onChange={this.onChangeDate}
                        />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Edit Exercise Log" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default ExercisesEdit;