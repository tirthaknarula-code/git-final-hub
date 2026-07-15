import { Component } from "react";
import { Instagram, ShoppingCart } from "react-feather";

export default class State extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      email: "",
      password: "",
    };

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleIncrement() {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  }

  handleDecrement() {
    this.setState((prevState) => ({
      count: prevState.count - 1,
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };

    localStorage.setItem("users", JSON.stringify(user));
    console.log(user);
  }

  render() {
    const { count, email, password } = this.state;

    return (
      <div>
        <ShoppingCart />
        <Instagram fill=" red" stroke="black" data-aos="flip-left" />
        <form onSubmit={this.handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h2>This is StateFul Component</h2>
        <button onClick={this.handleIncrement}>Increment</button>
        <br />
        <h3>Count: {count}</h3>
        <button onClick={this.handleDecrement}>Decrement</button>
      </div>
    );
  }
}
