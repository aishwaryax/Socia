import React, { Component } from 'react'
import { auth } from '../auth/auth'
import { commentOnPost } from './postApi'

export default class componentName extends Component {
    constructor(){
        super()
        this.state={
            comment: '',
            error: ''
        }
    }
    handleChange = (event) => {
        this.setState({comment: event.target.value})
    }
    handleSubmit = (event) => {
        event.preventDefault()
        var userId = auth().id
        var postId = this.props.postId
        var comment = this.state.comment
        commentOnPost({userId, postId, comment})
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            }
            else {
                this.props.renderComments(data.post)
                this.setState({comment: ''})
            }
        })
    }
    render() {
        return (
            <div>
                <h2 className="mt-5 mb-5">
                    Leave a comment
                </h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input placeholder="Share your thoughts" className="form-control" type="text" onChange={this.handleChange} value={this.state.comment} />
                    </div>
                    <button
                    className="btn btn-outline btn-primary mr-5"
                    onClick={this.handleSubmit}
                    >
                    Comment
                    </button>
                </form> 
            </div>
        )
    }
}
