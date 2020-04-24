import React from 'react';
import {Switch, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Form from './components/Form'
// import './App.css';
import ProfileContainer from './ProfileComponents/ProfileContainer'

import {withRouter} from 'react-router-dom'

class App extends React.Component {
  state = {
    user: {
      snacks: [],
      username: "",
      id: 0
    },
    token: ""
  }

  handleResponse = (resp) => {
    if (resp.user) {
      console.log(resp)
      localStorage.token = resp.token
      this.setState(resp, () => {
        this.props.history.push("/profile")
      })
    }
    else { 
      alert(resp.error)
    }
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      fetch("http://localhost:4000/persist", {
        headers: {
          "Authorization": `Bearer ${localStorage.token}`
        }
      })
      .then(r=> r.json())
      .then(this.handleResponse)

      // console.log(localStorage.token)
      // this.setState({token: localStorage.token})
    }
  }

  handleLoginSubmit = (userInfo) => {
    console.log("Login form has been submitted")

    fetch('http://localhost:4000/login', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(userInfo)
    })
    .then(r=>r.json())
    // .then(resp=>console.log(resp))
    .then(this.handleResponse)
    // .then(resp=> this.state.user.setState({username: resp.username}))
  }

  handleRegisterSubmit = (userInfo) => {
    console.log("Register form has been submitted")

    fetch('http://localhost:4000/users', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(userInfo)
    })
    .then(r => r.json())
    .then(this.handleResponse)
  }

  renderForm = (routerProps) => {
    if(routerProps.location.pathname === "/login"){
      return <Form formName="Login Form" handleSubmit={this.handleLoginSubmit}/>
    } else if (routerProps.location.pathname === "/register") {
      return <Form formName="Register Form" handleSubmit={this.handleRegisterSubmit}/>
    }
  }

  renderProfile = (routerProps) => {
    return <ProfileContainer user={this.state.user} addOneSnack={this.addOneSnack} />
  }

  render() {
    return (
      <div className="App">
        <NavBar/>
        <Switch>
          <Route path='/login' render={this.renderForm} />
          <Route path='/register' render={this.renderForm} />
          <Route path='/profile' render={this.renderProfile} />
          <Route path='/' exact render={ () => <Home/> } />
          <Route render={ () => <p>Page not found</p> } />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App);
// withRouter(boringComp) => magicalComp
