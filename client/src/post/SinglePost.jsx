import React, { Component } from 'react'
import { fetchPost, likeunlikePost, uncommentOnPost } from './postApi'
import { auth } from '../auth/auth'
import DefaultPost from '../images/DefaultPost.jpg'
import DefaultAvatar from '../images/DefaultAvatar.png'
import Like from '../images/like.png'
import Unlike from '../images/unlike.png'
import Comment from './Comment'

import { Link, Redirect } from 'react-router-dom'
import { deletePost} from './postApi'

class SinglePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: '',
            title: '',
            body: '',
            created: '',
            poster: {},
            redirectToHome: false,
            like: false, 
            likes: 0,
            comments: []
        }
    }

    deleteThisPost = () => {
        const token = auth().token
        const postId = this.props.match.params.postId
        //deleteUser
        deletePost(postId, token)
        .then(data => {
            if (data.error)
            {
                console.log('Post couldnt be deleted ', data.error)
            }
            else {
                this.setState({redirectToHome: true})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    confirmDelete = () => {
        let answer = window.confirm('Are you sure you want to delete your account?')
        if(answer){
            this.deleteThisPost()
        }
    }

    init = () => {
        var postId = this.props.match.params.postId
        var {token, id} = auth()
        fetchPost(postId, token)
        .then(data => {
            if (data.error) {
                this.setState({redirectToHome: true})
            }
            else {
                var {_id, title, body, createdBy, created} = data.post
                this.setState({_id, title, body, created, poster: createdBy, posterName: createdBy.name, likes: data.post.likes.length, like: data.post.likes.includes(id), comments: data.post.comments})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    renderComments = (post) => {
        this.setState({comments: post.comments})
    }

    uncomment = (comment) => {
        var postId = this.props.match.params.postId
        var {token} = auth()
        uncommentOnPost({token, postId, comment})
        .then(data => {
            if (data.error || !data.post) {
                this.setState({error: data.error})
            }
            else {
                this.setState({comments: data.post.comments})
            }
        })
    }

    likeToggle = () => {
        var postId = this.props.match.params.postId
        var { token, id } = auth()
        var like = this.state.like
        likeunlikePost(token, id, postId, like)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                this.setState({like: !this.state.like, likes: data.post.likes.length})
            }
        })
    }

    componentDidMount() {
        this.init()
    }

    render() {
        let commentsSection
        if (this.state.redirectToHome) {
            return (<Redirect to="/" />)
        }
        if (this.state) {
        var { _id, title, body, poster, created, comments} = this.state
        var posterName = poster.name
        var posterId = poster._id
        var {likes, like } = this.state
        if (_id)
        {
            var photoUrl = `${process.env.REACT_APP_API_URL}/post/${_id}/photo`
            commentsSection = (comments && comments.length > 0)?
            comments.map((comment, i) => (
                <div key={i}>
                    <div>
                        <Link to={`/user/${comment.postedBy._id}`}>
                            <img
                                style={{
                                    borderRadius: "50%",
                                    border: "1px solid black"
                                }}
                                className="float-left mr-2"
                                height="30px"
                                width="30px"
                                onError={i =>
                                    (i.target.src = `${DefaultAvatar}`)
                                }
                                src={`${
                                    process.env.REACT_APP_API_URL
                                }/user/${comment.postedBy._id}/profile`}
                                alt={comment.postedBy}
                            />
                            </Link>
                            <div>
                                <p className="lead">
                                    {comment.text}  
                                    <button onClick={()=>this.uncomment(comment)} className="btn btn-outline btn-danger" style={{float: "right"}}>
                                    Uncomment
                                </button>  
                                </p>  
                                <p className="font-italic mark">Says:                      
                                <Link to={`/user/${comment.postedBy._id}`}> {comment.postedBy.name}</Link> on {new Date(comment.created).toDateString()}
                                
                                </p>
                            </div>
                        
                        <hr />
                    </div>
                </div>
            )):
            <></>

        }
        return (
            <div className="container">
                <div className="card-body">
                    <h2 className="display-2 mt-5">{title}</h2>
                    <img
                    src={photoUrl}
                    alt={title}
                    className="img-thumbnail mb-3"
                    style={{height: "200px", width: "100%", objectFit: "cover"}}
                    onError={i => i.target.src=`${DefaultPost}`}/>
                    <p className="card-text">{body}</p>
                    <br />
                    <p className="font-italic mark">Posted By:
                    <Link to={`/user/${posterId}`}> {posterName}</Link> on {new Date(created).toDateString()}</p>
                    <div className="row">
                            <img 
                            src={(like)?Like:Unlike} 
                            alt={(like)?'like':'unlike'} 
                            style={{height: "40px", width: "40px"}}
                            onClick={this.likeToggle} />
                            
                        <h3>&nbsp;&nbsp;{likes} Likes</h3>
                    </div>
                    <hr />
                    {(comments.length>0)?
                    (<h2 className="mt-5 mb-5">{comments.length} Comments</h2>):
                    <h2 className="mt-5 mb-5">No Comments Yet!</h2>}
                    {commentsSection}
                    <Comment postId={_id} renderComments={this.renderComments}/>
                    <div className="d-inline-block">
                    <Link
                    className="btn btn-raised btn-info mr-5"
                    to="/"
                    >
                    Posts
                    </Link>
                    {(auth().id === posterId )?
                    (<><Link
                    className="btn btn-raised btn-success mr-5"
                    to={`/post/${_id}/edit`}
                    >
                    Edit Post
                    </Link>
                    <button
                    className="btn btn-raised btn-danger mr-5"
                    onClick={this.confirmDelete}
                    >
                    Delete Post
                    </button></>):<></>}
              </div>
            </div>
        </div>
            
        )}
    }
}

export default SinglePost
