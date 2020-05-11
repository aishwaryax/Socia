import React, { Component } from 'react'

class FollowButtons extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    followClick = () => {
        this.props.onButtonClick()
    }


    render() {
        
        return (
            <div className="d-inline-block">
                {!this.props.following ? (
                    <button
                        onClick={this.followClick}
                        className="btn btn-success btn-raised mr-5"
                    >
                        Follow
                    </button>
                ) : (
                    <button
                        onClick={this.followClick}
                        className="btn btn-warning btn-raised"
                    >
                        UnFollow
                    </button>
                )}
            </div>
        )
    }
}

export default FollowButtons