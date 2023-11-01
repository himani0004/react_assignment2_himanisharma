import React, { Component } from 'react';
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      number: '',
      email: '',
      gender: 'male',
      subjects: [],
      people: [],
      isEditing: false,
      editingPersonId: null,
    };
  }
 
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }
 
  handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;
    if (checked) {
      this.setState((prevState) => ({
        subjects: [...prevState.subjects, value],
      }));
    } else {
      this.setState((prevState) => ({
        subjects: prevState.subjects.filter((subject) => subject !== value),
      }));
    }
  }
 
  generateRandomID = () => {
    return Math.floor(Math.random() * 10000);
  }
 
  handleSubmit = (event) => {
    event.preventDefault();
 
    const { firstName, lastName, number, email, gender, subjects, isEditing, editingPersonId } = this.state;
 
    if (!isEditing) {
      // Adding a new person
      const id = this.generateRandomID();
      const person = {
        id,
        firstName,
        lastName,
        number,
        email,
        gender,
        subjects,
      };
 
      const updatedPeople = [...this.state.people, person];
      this.setState({
        people: updatedPeople,
        firstName: '',
        lastName: '',
        number: '',
        email: '',
        gender: 'male',
        subjects: [],
      });
 
      // Store data in local storage
      localStorage.setItem(`person_${id}`, JSON.stringify(person));
    } else {
      // Editing an existing person
      const updatedPeople = this.state.people.map((person) => {
        if (person.id === editingPersonId) {
          return {
            id: person.id,
            firstName,
            lastName,
            number,
            email,
            gender,
            subjects,
          };
        }
        return person;
      });
 
      this.setState({
        people: updatedPeople,
        firstName: '',
        lastName: '',
        number: '',
        email: '',
        gender: 'male',
        subjects: [],
        isEditing: false,
        editingPersonId: null,
      });
    }
  }
 
  handleEdit = (id) => {
    const personToEdit = this.state.people.find((person) => person.id === id);
 
    if (personToEdit) {
      this.setState({
        firstName: personToEdit.firstName,
        lastName: personToEdit.lastName,
        number: personToEdit.number,
        email: personToEdit.email,
        gender: personToEdit.gender,
        subjects: personToEdit.subjects,
        isEditing: true,
        editingPersonId: id,
      });
    }
  }
 
  handleDelete = (id) => {
    const updatedPeople = this.state.people.filter((person) => person.id !== id);
    this.setState({ people: updatedPeople });
    // Remove data from local storage
    localStorage.removeItem(`person_${id}`);
  }
 
  componentDidMount() {
    // Load existing data from local storage on page load
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("person_")) {
        const person = JSON.parse(localStorage.getItem(key));
        this.setState((prevState) => ({
          people: [...prevState.people, person],
        }));
      }
    }
  }
 
  render() {
    return (
<div>
<h2>Person Information</h2>
<form onSubmit={this.handleSubmit}>
<label htmlFor="firstName">First Name:</label>
<input
            type="text"
            id="firstName"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleInputChange}
            required
          /><br></br>
 
          <label htmlFor="lastName">Last Name:</label>
<input
            type="text"
            id="lastName"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleInputChange}
            required
          /><br></br>
 
          <label htmlFor="number">Phone Number (10 digits):</label>
<input
            type="text"
            id="number"
            name="number"
            value={this.state.number}
            onChange={this.handleInputChange}
            required
            disabled={this.state.isEditing} 
          /><br></br>
 
          <label htmlFor="email">Email:</label>
<input
            type="email"
            id="email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
            disabled={this.state.isEditing} 
          /><br></br>
 
          <label htmlFor="gender">Gender:</label>
<select
            id="gender"
            name="gender"
            value={this.state.gender}
            onChange={this.handleInputChange}
            required
>
<option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>
</select><br></br>
 
          <label>Subjects:</label><br></br>
<label>
<input
              type="checkbox"
              name="subjects"
              value="Math"
              checked={this.state.subjects.includes('Math')}
              onChange={this.handleCheckboxChange}
            />
            Math
</label><br></br>
<label>
<input
              type="checkbox"
              name="subjects"
              value="Science"
              checked={this.state.subjects.includes('Science')}
              onChange={this.handleCheckboxChange}
            />
            Science
</label><br></br>
<label>
<input
              type="checkbox"
              name="subjects"
              value="History"
              checked={this.state.subjects.includes('History')}
              onChange={this.handleCheckboxChange}
            />
            History
</label><br></br>
          {/* Add more subjects as needed */}
<button type="submit">{this.state.isEditing ? 'Update' : 'Submit'}</button>
</form>
 
        <h2>Person Table</h2>
<table>
<thead>
<tr>
<th>ID</th>
<th>First Name</th>
<th>Last Name</th>
<th>Phone Number</th>
<th>Email</th>
<th>Gender</th>
<th>Subjects</th>
<th>Action</th>
</tr>
</thead>
<tbody>
            {this.state.people.map(person => (
<tr key={person.id}>
<td>{person.id}</td>
<td>{person.firstName}</td>
<td>{person.lastName}</td>
<td>{person.number}</td>
<td>{person.email}</td>
<td>{person.gender}</td>
<td>{person.subjects.join(', ')}</td>
<td>
<button onClick={() => this.handleEdit(person.id)}>Edit</button>
<button onClick={() => this.handleDelete(person.id)}>Delete</button>
</td>
</tr>
            ))}
</tbody>
</table>
</div>
    );
  }
}
 
export default App;