import React from 'react'
import Posts from '../post/Posts'

const Home = () => {
    return (
        <div className='container'>
            <div className='jumbotron'>
                <h1>Home Page</h1>
                <p className='lead'>Read various blogs by people</p>
            </div>    
            <Posts />
        </div>
        
    )
    
}

export default Home