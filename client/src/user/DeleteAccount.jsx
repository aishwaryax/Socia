import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {auth, signout} from '../auth/auth'
import { deleteUser } from './userApi'

export default class DeleteAccount extends Component {

    constructor(){
        super()
        this.state = {
            redirect: false
        }
    }
    deleteAccount = () => {
        const token = auth().token
        const userId = this.props.userId
        //deleteUser
        deleteUser(userId, token)
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.error)
            {
                console.log('Account couldnt be deleted ', data.error)
            }
            else {
                signout(()=> console.log('User deleted'))
                this.setState({redirect: true})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    confirmDelete = () => {
        let answer = window.confirm('Are you sure you want to delete your account?')
        if(answer){
            this.deleteAccount()
        }
    }
    render() {
        if(this.state.redirect) {
            return (
                <Redirect to='/' />
            )
        }
        return (
            <div className='btn btn-raised btn-danger mr-5' onClick={this.confirmDelete}>
                Delete Profile
            </div>
        )
    }
}
