import React, { Component } from 'react'
import FormInput from '../components/FormInput'
import { fetchUser, editProfile } from './userApi'
import { auth, updateLocalUser } from '../auth/auth'
import { Redirect } from 'react-router-dom'
import DefaultAvatar from '../images/DefaultAvatar.png'




export default class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            _id: '',
            name: '',
            email: '',
            about: '',
            photo: '',
            error: '',
            fileSize: 0,
            edited: false,
            redirectToProfile: false
        }
    }

    handleChange = (name) => (event) => {
        var value = name === 'photo' ? event.target.files[0] : event.target.value
        var fileSize = name === 'photo' ? event.target.files[0].size : 0
        this.userData.set(name, value)
        this.setState({
            [name]: value,
            error: '',
            fileSize: fileSize
        })
    }

    handleSubmit = (event) => {
        const token = auth().token
        event.preventDefault()
        const userId = this.state._id
        this.userData.set('userId', userId)
        if (this.validate()) {
            editProfile(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else {
                        updateLocalUser(data.updatedUser, () => {
                            this.setState({
                                edited: true,
                                redirectToProfile: true
                            })
                        })
                    }
                })
        }
    }




    init = (userId) => {
        const token = auth().token
        fetchUser(userId, token)
            .then(response => {
                return response.json()
            })
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    const { email, name, _id, about } = data.user
                    this.setState({ email, name, _id, about })
                }
            })
    }

    validate = () => {
        const { email, name, fileSize, about } = this.state
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            this.setState({ error: 'Please enter a valid email' })
            return false
        } else if (name.length < 4) {
            this.setState({ error: 'Name should be of minimum length 4' })
            return false
        } else if (name.length > 20) {
            this.setState({ error: 'Name should be of maximum length 20' })
            return false
        } else if (fileSize > 4000000) {
            this.setState({ error: 'File size should be less than 4MB' })
            return false
        } else if (about.length > 200) {
            this.setState({ error: 'Describe yourself in less than 200 characters :)' })
            return false
        }
        return true
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    render() {
        const { error, _id, name, email, edited, redirectToProfile, about } = this.state
        const photoUrl = _id ? `${process.env.REACT_APP_API_URL}/user/${_id}/profile` : DefaultAvatar
        if (redirectToProfile) {
            return ( 
            <Redirect to = { `/user/${_id}` } />)
            }
        return ( 
        <div className = 'container'>
            <h2 className = 'mt5 mb-5' > Edit Profile </h2>  
            <div style = {{ display: (error) ? '' : 'none' }}
                className = "alert alert-danger" > { error } 
            </div>  
            <div style = {{ display: (edited) ? '' : 'none' }} className = "alert alert-info">
                Your profile has been updated 
            </div>
            <form>
                <div className = 'row' >
                <img style = {{ height: '200px', width: 'auto' }}
                className = "img-thumbnail"
                src = { photoUrl }
                alt = { name }
                /> 
                </div>

                <FormInput value = { name }
                handleChange = { this.handleChange('name') }
                labelName = 'Name'
                inputName = 'name' />
                <FormInput value = { email }
                handleChange = { this.handleChange('email') }
                labelName = 'Email'
                inputName = 'email' />
                <FormInput type = 'file'
                accept = 'image/*'
                handleChange = { this.handleChange('photo') }
                labelName = 'Profile Photo'
                inputName = 'photo' />
                <FormInput value = { about }
                textarea = { true }
                handleChange = { this.handleChange('about') }
                labelName = 'About'
                inputName = 'about' />
                <button onClick = { this.handleSubmit }
                className = 'btn btn-raised btn-primary' >
                Update 
                </button>                   
            </form> 
        </div>
    )}
}