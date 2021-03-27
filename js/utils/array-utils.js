class ArrayUtils {

    static getIndexesFromSize(lines) {

        let array = [];

        for (let i = 0; i < lines; i++) {
            array.push(i);
        }

        return array;
    }

    static getIndexes(lines, columns) {

        let array = [];

        for (let i = 0; i < lines; i++) {
            for (let j = 0; j < columns; j++) {
                array.push([i, j]);
            }
        }

        return array;
    }

    static copy(array) {

        let copy = [];

        for (let i = 0; i < array.length; i++) {
            copy.push(array[i]);
        }

        return copy;
    }

    static equals(array1, array2) {

        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }

        return true;
    }

    static search(array, value){

        for (let i = 0; i < array.length; i++) {
            if (ArrayUtils.equals(array[i], value)) {
                return array[i];
            }
        }
    }

    static contains(array, value) {

        for (let i = 0; i < array.length; i++) {
            if (ArrayUtils.equals(array[i], value)) {
                return true;
            }
        }

        return false;
    }

    static removeByValue(array, value) {

        var index = array.indexOf(value);

        if (index > -1) {
            array.splice(index, 1);
        }
    }

    static removeByValues(array, values) {

        let filtered = [];

        array.forEach(el1 => {
            if (!ArrayUtils.contains(values, el1)) {
                filtered.push(el1);
            }
        });

        return filtered;
    }
}
