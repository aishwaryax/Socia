import React from 'react'
import {Link, withRouter} from 'react-router-dom' 
import {auth, signout} from '../auth/auth'

const NavBar = ({history}) => {
    const path = history.location.pathname
    
    return ( 
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className={(path === '/')? 'nav-link active' : 'nav-link'} to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className={(path === '/users')? 'nav-link active' : 'nav-link'} to="/users">Users</Link>
                </li>
            {auth() ? (
            <>
            <li className="nav-item">
                    <Link className={(path === '/user/find')? 'nav-link active' : 'nav-link'} to="/user/find">Find People</Link>
                </li>
            <li className="nav-item">
                <div className='nav-link' onClick={()=>signout(()=> history.push('/'))}>Log out</div>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to={`/user/${auth().id}`}>{auth().name}</Link>
            </li>
        </>):(<>
            <li className="nav-item">
                <Link className={(path === '/login')? 'nav-link active' : 'nav-link'} to="/login">Login</Link>
            </li>
            <li className="nav-item">
                <Link className={(path === '/signup')? 'nav-link active' : 'nav-link'} to="/signup">Register</Link>
            </li></>)}
        </ul>
    </div>)
}

export default withRouter(NavBar)

