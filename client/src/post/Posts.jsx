import React, { Component } from 'react'
import { fetchAllPosts } from './postApi'
import { auth } from '../auth/auth'
import { Link } from 'react-router-dom'
import DefaultPost from '../images/DefaultPost.jpg'


class Posts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            posts: []
        }
    }

    init = () => {
        fetchAllPosts()
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.error)
            {
                this.setState({redirectToLogin: true})
            }
            else {
                this.setState({posts:data.posts})
            }
        })
        
    }

    componentDidMount() {
        const {id, token} = auth()
        this.init(id, token)
    }

    renderPosts = (posts) => {
        if (posts && posts.length > 0 ) {
            return (
                posts.map((post, key)=>{
                    const posterId = post.createdBy._id
                    const posterName = post.createdBy.name
                    const photoUrl = (post._id) ? `${process.env.REACT_APP_API_URL}/post/${post._id}/photo` : DefaultPost
                    return (
                    <div key={key} className="card col-md-4">
                        <div className="card-body">
                            <img src={photoUrl}
                            style={{height: "200px", width: "auto"}}
                            alt={post.title}
                            onError={key => key.target.src=`${DefaultPost}`}
                            className="img-thumbnail mb-3"
                            />
                            <h5 className="card-title">{post.title}</h5>
                            <p className="card-text">{post.body}</p>
                            <br />
                            <p className="font-italic mark">Posted By: 
                            <Link to={`/user/${posterId}`}> {posterName}</Link> on {new Date(post.created).toDateString()}</p>
                            <Link to={`/post/${post._id}`} className="btn btn-raised btn-primary btn-sm">Read more</Link>
                        </div>
                    </div>)})
            )
        }
        else {
            return (
                <p>No posts!</p>
            )
        } 
    }

    render() {
        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Recent Posts</h2>
                <div className='row'>
                {this.renderPosts(this.state.posts)}
            </div>            
        </div>
    )}
}

export default Posts
