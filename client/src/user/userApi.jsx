export const fetchUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
}

export const fetchAllUsers = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/user`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
}

export const deleteUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}
export const editProfile = (userId, token, userData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: userData
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const followUnfollowUser = ({ token, id, followId, following }) => {
    let apiEnd, body
    if (!following) {
        apiEnd = 'follow'
        body = {
            userId: id,
            followId: followId
        }
    } else {
        apiEnd = 'unfollow'
        body = {
            userId: id,
            unfollowId: followId
        }
    }
    return fetch(`${process.env.REACT_APP_API_URL}/user/${apiEnd}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const findPeople = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/find`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
}