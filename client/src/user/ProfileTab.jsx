import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import DefaultAvatar from '../images/DefaultAvatar.png'

export default class ProfileTab extends Component {

    
    render() {
        const {followers, following, posts} = this.props
        const postsSection = (posts && posts.length > 0)?
        posts.map((post, i) => (
            <div key={i}>
                <div>
                    <Link to={`/post/${post._id}`}>
                        <div>
                            <h1 className="lead">
                                {post.title}
                            </h1>
                        </div>
                    </Link>
                            <p className="lead">
                                {post.body}
                            </p>
                    <hr />
                        
                    
                </div>
            </div>
        )):<p>No followers! </p>
        const followersSection = (followers && followers.length > 0)?
        followers.map((person, i) => (
            <div key={i}>
                <div>
                    <Link to={`/user/${person._id}`}>
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
                            }/user/${person._id}/profile`}
                            alt={person.name}
                        />
                        <div>
                            <p className="lead">
                                {person.name}
                            </p>
                        </div>
                    </Link>
                    <hr />
                </div>
            </div>
        )):<p>No followers! </p>
            const followingSection = (following && following.length > 0)?
            following.map((person, i) => (
                <div key={i}>
                    <div>
                        <Link to={`/user/${person._id}`}>
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
                                }/user/${person._id}/profile`}
                                alt={person.name}
                            />
                            <div>
                                <p className="lead">
                                    {person.name}
                                </p>
                            </div>
                        </Link>
                        <hr />
                    </div>
                </div>
            )):<p>No following! </p>
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">Followers</h3>
                        <hr/>
                       {followersSection}
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-primary">Following</h3>
                        <hr/>
                       {followingSection}
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-primary">Posts</h3>
                        <hr/>
                       {postsSection}
                    </div>
                </div>
            </div>
        )
    }
}
