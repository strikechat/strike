import { useState } from "react"
import { AxiosInstance } from "../../lib/AxiosInstance"
import { UserController } from "../../lib/UserController"

export interface LoginRequestData {
    username: string
    password: string
}

export const LoginPage = () => {
    const [data, setData] = useState<LoginRequestData>({ username: '', password: '' })

    const login = async () => {
        await UserController.login(data.username, data.password);
    }

    return <>
        <input type="text" placeholder="Username" onChange={e => setData({ ...data, username: e.target.value })} />
        <br />
        <input type="password" placeholder="Password" className="mt-5" onChange={e => setData({ ...data, password: e.target.value })} />
        <br />
        <button className="mt-5" onClick={login}>Login</button>
    </>
}