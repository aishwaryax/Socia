import React from 'react'
import { auth } from './auth'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
        return ( < Route {...rest }
                render = {
                    props => auth() ?
                    ( < Component {...props }
                        />) :
                        ( < Redirect to = {
                                { pathname: "/login", state: { from: props.location } }
                            }
                            />)
                        }
                        />)        
                    }

                    export default PrivateRoute