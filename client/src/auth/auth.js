export const authenticate = (jwt, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(jwt))
        next()
    }
}

export const login = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-type": 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const signUp = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-type": 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
}

export const auth = () => {
    if (typeof window === 'undefined')
        return false
    else if (localStorage.getItem('jwt'))
        return JSON.parse(localStorage.getItem('jwt'))
    else
        return false
}

export const signout = (next) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt')
        next()
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST'
            })
            .then(response => {
                console.log(response)
                return response.json()
            })
    }
}

export const updateLocalUser = (updatedUser, next) => {
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('jwt'))
        auth.name = updatedUser.name
        localStorage.setItem('jwt', JSON.stringify(auth))
        next()
    }
}