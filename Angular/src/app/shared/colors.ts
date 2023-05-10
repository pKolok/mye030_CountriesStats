const colors: string[] = [
    "blue", "red", "green", "yellow", "black", "magenta", "purple", "gray", 
    "pink", "brown", "orange"];

for (let i = 0; i < 100; i++) {
    colors.push('#' + Math.floor(Math.random() * Math.pow(2,32) ^ 0xffffff)
        .toString(16).slice(-6));
}

export const Colors = colors;