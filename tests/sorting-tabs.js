"use strict";

describe('Sorting tabs based on the order', function () {

    it('should sort based on order', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 2},
            {id: 2, order: 1}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 2, order: 1},
            {id: 1, order: 2}
        ]);
    });

    it('should move non-ordered tabs after ordered tabs', function () {
        // Arrange
        var tabs = [
            {id: 1},
            {id: 2, order: 1}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 2, order: 1},
            {id: 1}
        ]);
    });

    it('should move "last" ordered tab after numerically ordered tabs', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 'last'},
            {id: 2, order: 1}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 2, order: 1},
            {id: 1, order: 'last'}
        ]);
    });

    it('should keep non-ordered tabs in configured order', function () {
        // Arrange
        var tabs = [
            {id: 1},
            {id: 2}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 1},
            {id: 2}
        ]);
    });

    it('should keep "last" ordered tabs in configured order', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 'last'},
            {id: 2, order: 'last'}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 1, order: 'last'},
            {id: 2, order: 'last'}
        ]);
    });

    it('should move non-ordered tabs between numerically ordered and "last" ordered tabs', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 'last'},
            {id: 2, order: 0},
            {id: 3}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 2, order: 0},
            {id: 3},
            {id: 1, order: 'last'}
        ]);
    });

    it('should keep numerically ordered tabs with the same index in the configured order', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 1},
            {id: 2, order: 1},
            {id: 3, order: 0}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 3, order: 0},
            {id: 1, order: 1},
            {id: 2, order: 1}
        ]);
    });

    it('should handle all cases together', function () {
        // Arrange
        var tabs = [
            {id: 1, order: 'last'},
            {id: 2, order: 3},
            {id: 3, order: 0},
            {id: 4},
            {id: 5, order: 0},
            {id: 6, order: 'last'}
        ];

        // Act
        sortTabs(tabs);

        // Assert
        expect(tabs).toEqual([
            {id: 3, order: 0},
            {id: 5, order: 0},
            {id: 2, order: 3},
            {id: 4},
            {id: 1, order: 'last'},
            {id: 6, order: 'last'}
        ]);
    });

});

function sortTabs(tabs) {
    tabs.sort(function (t1, t2) {
        if (!t1.hasOwnProperty('order')) {
            if (!t2.hasOwnProperty('order')) {
                return 0;
            }
            return (t2.order === 'last') ? -1 : 1;
        }

        if (t1.order === 'last') {
            return (t2.order === 'last') ? -1 : 1;
        }

        return (t2.order === 'last') ? -1 :  t1.order - t2.order;
    });
}