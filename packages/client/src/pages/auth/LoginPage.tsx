import { useState, useEffect } from "react"
import { AxiosInstance } from "../../lib/AxiosInstance"
import { UserController } from "../../lib/UserController"

export interface LoginRequestData {
    username: string
    password: string
}

export const LoginPage = () => {
    const [data, setData] = useState<LoginRequestData>({ username: '', password: '' })
    const [error, setError] = useState<string | null>(null)

    const login = async () => {
        if (!data.username || !data.password) {
            setError("Please enter a username and password.")
            return;
        }

        if (data.username.length < 4) {
            setError("Username must be at least 4 characters long.")
            return;
        }

        if (data.username.length > 32) {
            setError("Username must be at most 32 characters long.")
            return;
        }

        if (data.password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return;
        }

        try {
            await UserController.login(data.username, data.password);
            setError(null);
        } catch (e) {
            setError("Login failed. Please check your username and password.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400" 
                        onChange={e => setData({ ...data, username: e.target.value })} 
                    />
                </div>
                <div className="mb-6">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400" 
                        onChange={e => setData({ ...data, password: e.target.value })} 
                    />
                </div>
                <button 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300" 
                    onClick={login}
                >
                    Login
                </button>
            </div>
        </div>
    )
}
