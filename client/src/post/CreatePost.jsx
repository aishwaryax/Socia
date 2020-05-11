import React, { Component } from 'react'
import { auth } from '../auth/auth'
import FormInput from '../components/FormInput'
import { createPost } from './postApi'
import { Redirect } from 'react-router-dom'

class CreatePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            fileSize: 0,
            created: false,
            redirectToProfile: false
        }
    }

    componentDidMount() {
        this.postData = new FormData()
        var { email, id, name } = auth()
        this.setState({ user: { email, _id: id, name } })
    }

    validate = () => {
        const { title, body, fileSize } = this.state
        if (title.length < 3) {
            this.setState({ error: 'Title should be of minimum length 3' })
            return false
        } else if (body.length < 20) {
            this.setState({ error: 'Post should be of minimum length 20' })
            return false
        } else if (fileSize > 4000000) {
            this.setState({ error: 'File size should be less than 4MB' })
            return false
        }

        return true
    }

    handleChange = (name) => (event) => {
        var value = name === 'photo' ? event.target.files[0] : event.target.value
        var fileSize = name === 'photo' ? event.target.files[0].size : 0
        this.postData.set(name, value)
        this.setState({
            [name]: value,
            error: '',
            fileSize: fileSize
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const token = auth().token
        const userId = auth().id
        this.postData.set('createdBy', userId)
        if (this.validate()) {
            createPost(token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else {
                        this.setState({ created: true, redirectToProfile: true })
                    }
                })
        }
    }


    render() {
        const { error, created, title, body, redirectToProfile, user } = this.state
        if (redirectToProfile) {
                return (
                    <Redirect to={`/user/${user._id}`} />
                )
            }
        return ( 
        <div className = 'container' >
            <h2 className = 'mt5 mb-5' > Create Post </h2>  
            <div style = {{ display: (error) ? '' : 'none' }} className = "alert alert-danger" > { error } 
            </div>  
            <div style = {{ display: (created) ? '' : 'none' }} className = "alert alert-info" >
            Your post has been created 
            </div>
            <form>
                <FormInput value = { title }
                handleChange = { this.handleChange('title') }
                labelName = 'Title'
                inputName = 'title' />
                <FormInput value = { body }
                textarea = { true }
                handleChange = { this.handleChange('body') }
                labelName = 'body'
                inputName = 'body' />
                <FormInput type = 'file'
                accept = 'image/*'
                handleChange = { this.handleChange('photo') }
                labelName = 'Profile Photo'
                inputName = 'photo' />
                <button onClick = { this.handleSubmit } className = 'btn btn-raised btn-primary'>
                Create 
                </button>                   
            </form > 
        </div>

        )
    }
}

export default CreatePost