import React, { Component } from 'react'
import { findPeople } from './userApi'
import {Link} from 'react-router-dom'
import DefaultAvatar from '../images/DefaultAvatar.png'
import {auth} from '../auth/auth'
import {followUnfollowUser} from './userApi'

class FindPeople extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: []
        }
    }

    clickFollow = (user, key) => {
        var {id, token} = auth()
        var followId = user._id
        followUnfollowUser({token, id, followId, following: false})
        .then(data => {
            console.log(data)
            if (data.error) {
                this.setState({error: data.error})
            }
            else {
                let users = this.state.users
                users.splice(key, 1)
                this.setState({users})
            }
        })
    }

    init = (userId, token) => {
        findPeople(userId, token)
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.error)
            {
                this.setState({redirectToLogin: true})
            }
            else {
                this.setState({users:data.users})
            }
        })
    }

    componentDidMount() {
        const {id, token} = auth()
        this.init(id, token)
    }

    render() {
        const usersSection = (this.state.users && this.state.users.length > 0 ) ? 
        this.state.users.map((user, key)=>(
            <div key={key} className='col-md-4'>
                <div className="card" style={{width: '18rem'}}>
                <img style={{width: '100%', height: '15vw', objectFit: 'cover'}} 
                className="card-img-top" 
                src={`${process.env.REACT_APP_API_URL}/user/${user._id}/profile`} 
                onError = {i => (i.target.src = `${DefaultAvatar}`)}
                alt={user.name}
                 />
                <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                    <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">View Profile</Link>
                    <button onClick={()=>this.clickFollow(user, key)} className="btn btn-raised btn-info float-right btn-sm">Follow</button>
                </div>
            </div>
        </div>)): <p>No one to follow!</p>


        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>All Users</h2>
                <div className='row'>
                {usersSection}
            </div>            
        </div>
    )}
}

export default FindPeople
