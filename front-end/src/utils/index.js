import jwt_decode from 'jwt-decode'

export const createOrGetUser = async (response, addUser) => {

    const decoded = jwt_decode(response.credential)
    localStorage.setItem('user', JSON.stringify(decoded))
    const { name, picture, sub } = decoded
    const user = {
        _id: sub,
        _type: 'user',
        username: name,
        image: picture
    }

    console.log(decoded);
}