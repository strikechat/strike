export const useCachedUser = () => {
    const user = localStorage.getItem('user-cache')
    return user ? JSON.parse(user) : null
}
    