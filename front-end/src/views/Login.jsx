import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { useNavigate } from "react-router-dom"
import jwt_decode from 'jwt-decode'
import { client } from '../client'
import heroVideo from '../assets/Hero_video.mp4'
import logo from '../assets/1.png'

const Login = () => {


    const navigate = useNavigate()

    const createOrGetUser = async (response) => {

        const decoded = jwt_decode(response.credential)
        localStorage.setItem('user', JSON.stringify(decoded))
        const { name, picture, sub } = decoded
        const user = {
            _id: sub,
            _type: 'user',
            username: name,
            image: picture
        }

        client.createIfNotExists(user)
            .then(() => {
                navigate('/')
            })

        console.log(decoded);
    }

    return (
        <div className="flex justify-start items-center flex-col h-screen">
            <div className="relative w-full h-full">
                <video
                    src={heroVideo}
                    type='video/mp4'
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className="object-cover w-full h-full"
                />
                <div className="absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} width='230px' alt="logo" />
                    </div>
                    <div className="shadow-2xl">
                        <GoogleLogin
                            onSuccess={(response) => createOrGetUser(response)}
                            onError={() => console.log("Error!")} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
