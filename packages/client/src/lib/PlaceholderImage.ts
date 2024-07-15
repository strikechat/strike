export class PlaceholderImage {
    public static getSrc(width: number, height: number, text: string) {
        return `https://via.assets.so/img.jpg?w=${width}&h=${height}&tc=white&bg=%235c5a5a&t=${text}`;
    }

    public static getFirstLetters(text: string) {
        return text
            .split(' ')
            .map((word) => word[0].toUpperCase())
            .join('');
    }
}
