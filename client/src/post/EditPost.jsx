import React, { Component } from 'react'
import FormInput from '../components/FormInput'
import { editPost, fetchPost } from './postApi'
import { auth } from '../auth/auth'
import { Redirect } from 'react-router-dom'
import DefaultAvatar from '../images/DefaultAvatar.png'




export default class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            _id: '',
            title: '',
            body: '',
            photo: '',
            error: '',
            user: {},
            fileSize: 0,
            redirectToProfile: false
        }
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
        const token = auth().token
        event.preventDefault()
        const postId = this.state._id
        this.postData.set('postId', postId)
        if (this.validate()) {
            editPost(postId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error })
                    } else {
                            this.setState({
                                edited: true,
                                redirectToProfile: true
                        })
                    }
                })
            }
        }




    init = (postId) => {
        const token = auth().token
        fetchPost(postId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    const { title, body, _id } = data.post
                    this.setState({ title, body, _id })
                }
            })
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

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId
        this.init(postId)
    }

    render() {
        const { error, _id, name, title, edited, redirectToProfile, body } = this.state
        console.log(_id)
        const photoUrl = _id ? `${process.env.REACT_APP_API_URL}/post/${_id}/photo` : DefaultAvatar
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
                onError = {i => i.target.src=`${DefaultAvatar}`}
                /> 
                </div>

                <FormInput value = { title }
                handleChange = { this.handleChange('title') }
                labelName = 'Title'
                inputName = 'title' />
                <FormInput value = { body }
                handleChange = { this.handleChange('body') }
                textarea = {true}
                labelName = 'Body'
                inputName = 'body' />
                <FormInput type = 'file'
                accept = 'image/*'
                handleChange = { this.handleChange('photo') }
                labelName = 'Profile Photo'
                inputName = 'photo' />
                <button onClick = { this.handleSubmit }
                className = 'btn btn-raised btn-primary' >
                Update 
                </button>                   
            </form> 
        </div>
    )}
}