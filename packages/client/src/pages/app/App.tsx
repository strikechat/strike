import { useEffect, useState } from "react"
import { UserController } from "../../lib/UserController"

export const App = () => {
    const [user, setUser] = useState<any>({})

    const getCurrentUserData = async () => {
        setUser(await UserController.me())
    }

    useEffect(() => {
        getCurrentUserData()
    }, [])

    return (
        <>
            {JSON.stringify(user)}
        </>
    )
}