import React, { Component } from 'react'
import FormInput from '../components/FormInput'
import { Redirect } from 'react-router-dom'
import {login, authenticate} from '../auth/auth'

export default class Signin extends Component {
    constructor () {
        super()
        this.state = {
            email: '',
            password: '',
            name: '',
            authenticated: false,
            redirect: false,
            loading: false,
            error: ''
        }
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value,
        error: ''})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({loading: true})
        const {name, email, password, confirmPassword} = this.state
        const user = {name, email, password, confirmPassword}
        login(user)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error, loading: false})
            }
            else {
                this.setState({
                    email:'',
                    password: '',
                    error: '',
                    authenticated: true
                })
                authenticate(data, () => {
                    this.setState({redirect: true})
                })

            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    

    render() {
        const {email, password, error, authenticated, redirect, loading} = this.state

        if(redirect) {
            return (
                <Redirect to='/'/>
            )
        }
        return ( 
            <div className='container'>
            <h2 className='mt5 mb-5'>Sign In Page</h2>
            <div style={{display: (error)? '': 'none'}} className="alert alert-danger">
                {error}           
            </div>
            <div style={{display: (authenticated)? '': 'none'}} className="alert alert-info">
                You are logged in           
            </div>
            <div style={{display: (loading)? '': 'none'}} className="jumbotron text-center">
                <h2>Loading...</h2>           
            </div>
            <form>
                <FormInput 
                    value={email} 
                    handleChange={this.handleChange('email')} 
                    labelName='Email' 
                    inputName='email'/>
                <FormInput type='password' 
                    value={password} 
                    handleChange={this.handleChange('password')} 
                    labelName='Pasword' 
                    inputName='password'/>
                <button onClick={this.handleSubmit} className='btn btn-raised btn-primary'>Submit</button>
                </form>
            </div>
        )
    }
}