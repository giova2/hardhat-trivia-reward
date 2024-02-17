import { NUMBER_OF_QUESTIONS } from "../constants";

export const triviaRequest = async () => {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${NUMBER_OF_QUESTIONS}&type=multiple&difficulty=medium`);
    const parsedResponse = await response.json();
    return parsedResponse?.results ? parsedResponse?.results : [];
  } catch (error) {
    console.error('Error when trying to obtain data:', error);

    if (error.response && error.response.status === 429) {
      console.log('Too many requests. Wait a moment before trying again.');
    }
  }
}

export const shuffleArray = (array)  => {
  // Copia el array original para no modificarlo directamente
  const shuffledArray = array.slice();

  // Algoritmo de Durstenfeld para mezclar el array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Intercambia elementos
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export const parseHTML = (text) =>{
  const container = document.createElement('p');

  container.innerHTML = text;
  return container.innerHTML;
}

export const parseHTMLForArrays = (arrText) =>{
  return arrText.map((text) => parseHTML(text));
}