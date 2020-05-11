import React, { Component } from 'react'
import FormInput from '../components/FormInput'
import {signUp} from '../auth/auth'
import {Link} from 'react-router-dom'
export default class SignUp extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            created: false
        }
        this.userData = {}
    }

    handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value 
        this.setState({[name]: value,
        error: ''})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const {name, email, password, confirmPassword} = this.state
        const user = {name, email, password, confirmPassword}
        signUp(user)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            }
            else {
                this.setState({
                    name:'',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    error: '',
                    created: true
                })
            }
        })
    }



    render() {
        const {name, email, password, confirmPassword, error, created} = this.state
        return ( 
        <div className='container'>
            <h2 className='mt5 mb-5'>Sign up Page</h2>
            <div style={{display: (error)? '': 'none'}} className="alert alert-danger">
                {error.msg}           
            </div>
            <div style={{display: (created)? '': 'none'}} className="alert alert-info">
                Your account is created. Please <Link to='/login'>Sign in</Link>            
            </div>
            <form>
                <FormInput 
                    value={name} 
                    handleChange={this.handleChange('name')} 
                    labelName='Name' 
                    inputName='name'/>
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
                <FormInput 
                    type='password' 
                    value={confirmPassword} 
                    handleChange={this.handleChange('confirmPassword')} 
                    labelName='Confirm Password' 
                    inputName='confirmPassword'/> 
                
                <button onClick={this.handleSubmit} className='btn btn-raised btn-primary'>Submit</button>                 
            </form>
        </div>
        )
    }
}