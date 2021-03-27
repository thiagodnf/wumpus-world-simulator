class ArrayUtils {

    static getIndexes(array) {
        return Array(array.length).fill(0).map((e, i) => i);
    }

    static removeByValue(array, value) {

        var index = array.indexOf(value);

        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
