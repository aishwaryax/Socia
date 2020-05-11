import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { fetchUser, followUnfollowUser } from './userApi'
import { auth } from '../auth/auth'
import DefaultAvatar from '../images/DefaultAvatar.png'
import FollowButtons from '../components/FollowButtons'
import ProfileTab from './ProfileTab'
import DeleteAccount from './DeleteAccount'
import { fetchPostsByUser } from '../post/postApi'



export default class Profile extends Component {

    constructor() {
        super()
        this.state = {
            user: '',
            redirectToHp: false,
            following: false
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
                    this.setState({ redirectToHome: true })
                } else {
                    let following = this.checkFollow(data.user)
                    this.setState({ user: data.user, following: following })
                }
            })
        fetchPostsByUser(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToHome: true })
                } else {
                    this.setState({ posts: data.posts })
                }
            })

    }

    checkFollow = (user) => {
        const jwt = auth()
        const match = user.followers.find(follower => {
            return (follower._id === jwt.id)
        })
        return match
    }


    clickFollow = () => {
        var { id, token } = auth()
        var followId = this.props.match.params.userId
        var follow = this.state.following
        followUnfollowUser({ token, id, followId, following: follow })
            .then(data => {
                console.log(data)
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data.user, following: !this.state.following })
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    componentDidUpdate() {
        const userId = this.props.match.params.userId
        if (this.state.user)
            if (userId !== this.state.user._id)
                this.init(userId)
    }

    render() {

        if (this.state.redirectToHome) {
            return ( <
                Redirect to = '/' / >
            )
        }

        const user = this.state.user
        if (!user) {
            return ( 
                <h1 > Loading... </h1>
            )
        }
        const photoUrl = (user._id) ? `${process.env.REACT_APP_API_URL}/user/${user._id}/profile` : DefaultAvatar
        return ( 
            <div className = "container" >
            <h2 className = "mt-5 mb-5" > Profile </h2> 
            <div className = "row" >
                <div className = "col-md-4" >
                    <img style = {{ height: "200px", width: "auto" }}
                    className = "img-thumbnail"
                    src = { photoUrl }
                    onError = { i => (i.target.src = `${DefaultAvatar}`) }
                    alt = { user.name }/> 
                </div>
            <div className = "col-md-8" >
            <div className = "lead mt-2" >
                <p> Hello { user.name } </p> 
                <p> Email: { user.email } </p> 
                <p> { `Joined ${new Date(user.created).toDateString()}` } </p> 
            </div>

            {
                auth().id &&
                auth().id === user._id ? ( 
                    <div className = "d-inline-block" >
                        <Link className = "btn btn-raised btn-info mr-5" to = "/post/create" >
                            Create Post 
                        </Link>
                        <Link className = "btn btn-raised btn-success mr-5" to = { `/user/${user._id}/edit` } >
                            Edit Profile 
                        </Link> 
                        <DeleteAccount userId = { user._id }/> 
                    </div >
                ) : ( 
                    <FollowButtons following = { this.state.following } onButtonClick = { this.clickFollow }/>
                )
            } 
            </div> 
        </div > 
        <div className = "row" >
            <div className = "col md-12 mt-5 mb-5" >
                <hr/>
                <p className = "lead" > { user.about } </p> 
                <hr />
                <ProfileTab followers = { user.followers }
                following = { user.following }
                posts = { this.state.posts }/> 
            </div> 
        </div> 
    </div>
    )}
}