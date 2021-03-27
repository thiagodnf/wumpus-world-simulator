class RandomUtils {

    /**
     * @param {number} min
     * @param {number} max
     * @returns a random number between min (included) and max (excluded)
     */
    static getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static getRandomIndex(array) {
        return RandomUtils.getRandomInteger(0, array.length);
    }

    static getRandomElement(array) {
        return array[RandomUtils.getRandomIndex(array)];
    }

    /**
     * @param {array} array should not be null
     * @param {number} numberOfItems should be greater or equals to 1 and less or equals to array.length
     * @returns a random set from array
     */
    static getRandomElements(array, numberOfItems) {

        if (numberOfItems < 1) {
            throw new Error("numberOfItems should not be less than 1");
        }

        if (numberOfItems > array.length) {
            throw new Error("numberOfItems should not be greater than 'array.length'");
        }

        let indexes = ArrayUtils.getIndexes(array);

        let selected = [];

        for (let i = 0; i < numberOfItems; i++) {

            let index = RandomUtils.getRandomElement(indexes);

            selected.push(array[index]);

            ArrayUtils.removeByValue(indexes, index);
        }

        return selected;
    }
}
