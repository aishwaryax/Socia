import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Signup from './user/Signup'
import Login from './user/Login'
import Profile from './user/Profile'
import NavBar from './components/NavBar'
import Users from './user/Users'
import EditProfile from './user/EditProfile'
import PrivateRoute from './auth/PrivateRoute'
import FindPeople from './user/FindPeople'
import CreatePost from './post/CreatePost'
import SinglePost from './post/SinglePost'
import EditPost from './post/EditPost'

const MainRouter = () => {
    return (
        <div>
            <NavBar />
            <Switch>
                <Route exact path='/' component={Home}></Route>
                <Route exact path='/users' component={Users}></Route>
                <Route exact path='/signup' component={Signup}></Route>
                <Route exact path='/login' component={Login}></Route>
                <PrivateRoute exact path='/user/:userId/edit' component={EditProfile}></PrivateRoute>
                <PrivateRoute exact path='/user/find' component={FindPeople}></PrivateRoute>
                <Route exact path='/user/:userId' component={Profile}></Route>
                <PrivateRoute exact path='/post/create' component={CreatePost}></PrivateRoute>
                <PrivateRoute exact path='/post/:postId/edit' component={EditPost}></PrivateRoute>
                <Route exact path='/post/:postId' component={SinglePost}></Route>

                
            </Switch>
        </div>
    )
}

export default MainRouter
