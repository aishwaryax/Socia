export const fetchPost = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
            method: "GET",
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

export const fetchAllPosts = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
}

export const createPost = (token, postData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: postData
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const editPost = (postId, token, postData) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: postData
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const deletePost = (postId, token) => {
    console.log(postId, token)
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

export const fetchPostsByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/by/${userId}`, {
            method: "GET",
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

export const likeunlikePost = (token, userId, postId, like) => {
    var status
    if (!like) {
        status = 'like'
    } else {
        status = 'unlike'
    }

    return fetch(`${process.env.REACT_APP_API_URL}/post/${status}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ postId, userId })
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const commentOnPost = ({ token, postId, userId, comment }) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ postId, comment: { text: comment, postedBy: userId } })
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const uncommentOnPost = ({ token, postId, comment }) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ postId, comment })
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}