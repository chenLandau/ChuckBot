export const jokesArray = [];

export const checkValidJokesArray = () => {
  if (jokesArray.length !== 101) return false;
  return true;
};

export const addJoke = (jokeText) => {
  jokesArray.push(jokeText.trim());
};

export const getJokeByIndex = (index) => {
  const foundJoke = jokesArray[index - 1];
  return foundJoke;
};
