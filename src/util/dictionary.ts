import dictionary from '../data/wordle-eng.json';

export const isProper = (word) => dictionary.includes(word);

export const getRandomWord = () => {
    const index = Math.floor(Math.random() * dictionary.length);

    return dictionary[index]
}