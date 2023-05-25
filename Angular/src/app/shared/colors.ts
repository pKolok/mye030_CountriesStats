const colors: string[] = [
    "blue", "red", "green", "orange", "black", "magenta", "gray", "pink",
    "brown", "purple"];

for (let i = 0; i < 40; i++) {
    colors.push('#' + Math.floor(Math.random() * Math.pow(2,32) ^ 0xffffff)
        .toString(16).slice(-6));
}

export const Colors = colors;