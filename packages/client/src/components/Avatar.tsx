const Avatar = ({ width = '50px', height = '50px', text = '', src = '' }) => {
    return (
        <div
            className="flex items-center justify-center rounded-full text-gray-400 bg-background-primary"
            style={{ width, height }}
        >
            {src ? (
                <img
                    src={src}
                    alt="avatar"
                    className="rounded-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                />
            ) : (
                <span className="font-bold text-lg">{text.split(' ').map(x => x[0].toUpperCase()).join('')}</span>
            )}
        </div>
    )
}

export default Avatar
