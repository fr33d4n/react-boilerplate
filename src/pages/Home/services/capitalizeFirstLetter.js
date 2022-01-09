const capitalizeFirstLetter = (string) => {
    const lowerCaseText = string.toLowerCase();
    return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);
};

export default capitalizeFirstLetter;
