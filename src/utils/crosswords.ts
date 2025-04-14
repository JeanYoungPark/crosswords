import { Clue } from "./typing";

interface Position {
    x: number;
    y: number;
    direction: number;
    crossingPoint: number;
}

interface QuestionItem {
    x: number;
    y: number;
    d: number;
    num?: number;
    clue: string;
    longClue?: string;
    word: string;
    sound?: string;
    direction?: number;
}

interface AlternativeGrid {
    Grid: string[][];
    Words: Word[];
    QuestionGrid: string[][];
    QuestionList: QuestionItem[];
    WordGroupsCount: number;
}

class Word {
    word: string;
    clue: string;
    longClue?: string;
    sound?: string;
    crossingPositions: Position[] = [];
    availablePositions: Position[] = [];
    orphaned: boolean = true;
    posIndex: number = -1;
    chosenPosition: Position | null = null;

    constructor(item: Clue) {
        this.word = item.word;
        this.clue = item.clue;
        this.longClue = item.longClue;
        this.sound = item.sound;
    }

    resetArrays(): void {
        this.crossingPositions = [];
        this.availablePositions = [];
    }

    reset(): void {
        this.resetArrays();
        this.orphaned = true;
        this.posIndex = -1;
        this.chosenPosition = null;
    }
}

export class XWords {
    private HORIZONTAL = 1;
    private VERTICAL = 2;
    private MAX_RUNTIME = 1000;
    private MAX_PASSES = 20;
    private UNSET = -1;
    private HEAD_CHAR = "#";

    private Grid: string[][] = [];
    public QuestionGrid: string[][] = [];
    private Words: Word[] = [];
    public QuestionList: QuestionItem[] = [];

    private bestFit: AlternativeGrid | null = null;
    private sErrors: string = "";

    Reset() {
        this.Grid = [];
        this.QuestionGrid = new Array();
        this.QuestionList = new Array();
    }

    ResetComplete() {
        this.Reset();

        this.Words = [];
        this.bestFit = null;
        this.sErrors = "";
    }

    create(height: number, width: number, arrayOfWords: Clue[]) {
        const time1 = new Date().getTime();
        let lIteration = 1;

        this.ResetComplete();
        this.bestFit = null;

        for (var x = 0; x < arrayOfWords.length; x++) {
            var item = arrayOfWords[x];
            this.Words.push(new Word(item));
        }

        do {
            this.Reset();

            this.Grid = new Array(width);
            this.QuestionGrid = new Array(width);

            for (var i = 0; i < this.Grid.length; i++) {
                this.Grid[i] = new Array(height);
                this.QuestionGrid[i] = new Array(height);
            }

            for (var i = 0; i < this.Grid.length; i++) {
                for (var j = 0; j < this.Grid[0].length; j++) {
                    this.Grid[i][j] = "";
                    this.QuestionGrid[i][j] = "";
                }
            }

            this.SortByLength(this.Words);

            for (var y = 1; y <= this.MAX_PASSES; y++) {
                for (var x = 0; x < this.Words.length; x++) {
                    if ((this.Words[x].orphaned && this.Words[x].posIndex == this.UNSET) || y == 1) {
                        this.Words[x].reset();
                        this.AddWord(this.Words[x], x, y);
                    }
                }
            }

            this.GenerateQuestionGrid();

            for (var x = 0; x < this.Words.length; x++) {
                this.Words[x].crossingPositions = new Array();

                var check_x = -1,
                    check_y = -1,
                    check_d = -1;

                for (var k = 0; k < this.QuestionList.length; k++) {
                    if (this.QuestionList[k].word == this.Words[x].word) {
                        if (this.QuestionList[k].d == this.HORIZONTAL) {
                            check_d = this.HORIZONTAL;
                        } else if (this.QuestionList[k].d == this.VERTICAL) {
                            check_d = this.VERTICAL;
                        }
                        check_x = this.QuestionList[k].x;
                        check_y = this.QuestionList[k].y;
                    }
                }

                if (check_x != -1 && check_y != -1) {
                    if (check_d == this.HORIZONTAL) {
                        for (var count = 0; count < this.Words[x].word.length; count++) {
                            for (var k = 0; k < this.QuestionList.length; k++) {
                                if (this.QuestionList[k].d != this.HORIZONTAL && this.QuestionList[k].word != this.Words[x].word) {
                                    for (var count2 = 0; count2 < this.QuestionList[k].word.length; count2++) {
                                        if (
                                            Math.floor(this.QuestionList[k].x) == check_x + count &&
                                            Math.floor(this.QuestionList[k].y) + count2 == check_y
                                        ) {
                                            this.Words[x].crossingPositions.push({
                                                x: this.QuestionList[k].x,
                                                y: this.QuestionList[k].y,
                                                direction: this.QuestionList[k].d,
                                                crossingPoint: this.QuestionList[k].num ?? 0,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    } else if (check_d == this.VERTICAL) {
                        for (var count = 0; count < this.Words[x].word.length; count++) {
                            for (var k = 0; k < this.QuestionList.length; k++) {
                                if (this.QuestionList[k].d != this.VERTICAL && this.QuestionList[k].word != this.Words[x].word) {
                                    for (var count2 = 0; count2 < this.QuestionList[k].word.length; count2++) {
                                        if (
                                            Math.floor(this.QuestionList[k].x) + count2 == check_x &&
                                            Math.floor(this.QuestionList[k].y) == check_y + count
                                        ) {
                                            this.Words[x].crossingPositions.push({
                                                x: this.QuestionList[k].x,
                                                y: this.QuestionList[k].y,
                                                direction: this.QuestionList[k].d,
                                                crossingPoint: this.QuestionList[k].num ?? 0,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (var x = 0; x < this.Words.length; x++) {
                if (this.Words[x].chosenPosition == null || this.Words[x].crossingPositions.length == 0) {
                    for (var k = 0; k < this.QuestionList.length; k++) {
                        try {
                            if (this.QuestionList[k].word == this.Words[x].word) {
                                for (var count = 0; count < this.Words[x].word.length; count++) {
                                    if (this.QuestionList[k].d == this.HORIZONTAL) {
                                        this.Grid[Math.floor(this.QuestionList[k].x) + count][Math.floor(this.QuestionList[k].y)] = "";
                                    } else if (this.QuestionList[k].d == this.VERTICAL) {
                                        this.Grid[Math.floor(this.QuestionList[k].x)][Math.floor(this.QuestionList[k].y + count)] = "";
                                    }
                                }
                                delete this.QuestionList[k];
                            }
                        } catch (e) {}
                    }
                }
            }

            this.QuestionList.sort();

            var tmpQuestionList = new Array();
            for (var k = 0; k < this.QuestionList.length; k++) {
                if (this.QuestionList[k]) {
                    tmpQuestionList.push(this.QuestionList[k]);
                }
            }
            this.QuestionList = tmpQuestionList;

            this.Grid = new Array(width);
            for (var i = 0; i < this.Grid.length; i++) {
                this.Grid[i] = new Array(height);
                this.QuestionGrid[i] = new Array(height);
            }

            for (var i = 0; i < this.Grid.length; i++) {
                for (var j = 0; j < this.Grid[0].length; j++) {
                    this.Grid[i][j] = "";
                    this.QuestionGrid[i][j] = "";
                }
            }

            for (var x = 0; x < this.Words.length; x++) {
                if (this.Words[x].crossingPositions.length > 0) {
                    for (var k = 0; k < this.QuestionList.length; k++) {
                        try {
                            if (this.QuestionList[k].word == this.Words[x].word) {
                                for (var count = 0; count < this.Words[x].word.length; count++) {
                                    if (this.QuestionList[k].d == this.HORIZONTAL) {
                                        this.Grid[Math.floor(this.QuestionList[k].x) + count][Math.floor(this.QuestionList[k].y)] =
                                            this.Words[x].word.charAt(count);
                                    } else if (this.QuestionList[k].d == this.VERTICAL) {
                                        this.Grid[Math.floor(this.QuestionList[k].x)][Math.floor(this.QuestionList[k].y) + count] =
                                            this.Words[x].word.charAt(count);
                                    }
                                }
                            }
                        } catch (e) {}
                    }
                }
            }

            lIteration++;

            if (this.bestFit != null) {
                if (this.bestFit.WordGroupsCount < this.GetNumberOfWordGroups()) {
                    this.bestFit = null;
                    this.bestFit = {
                        Grid: this.Grid.slice(),
                        Words: this.Words.slice(),
                        QuestionGrid: this.QuestionGrid.slice(),
                        QuestionList: this.QuestionList.slice(),
                        WordGroupsCount: this.GetNumberOfWordGroups(),
                    };
                }
            } else {
                var x = this.GetNumberOfWordGroups();
                this.bestFit = {
                    Grid: this.Grid.slice(),
                    Words: this.Words.slice(),
                    QuestionGrid: this.QuestionGrid.slice(),
                    QuestionList: this.QuestionList.slice(),
                    WordGroupsCount: this.GetNumberOfWordGroups(),
                };
            }
        } while (new Date().getTime() - time1 < this.MAX_RUNTIME && this.GetNumberOfWordGroups() > 1);
    }

    // INDICATES HOW MANY GROUPINGS OF WORDS ARE ON THE GRID
    private GetNumberOfWordGroups() {
        var iReturn = 0;
        for (var x = 0; x < this.Words.length; x++) {
            if (this.Words[x].crossingPositions.length > 0) {
                iReturn++;
            }
        }
        return iReturn;
    }

    private SortByLength(arr: Word[]) {
        arr.sort(function (a: Word, b: Word) {
            return a.word.length - b.word.length;
        });
        return arr;
    }

    private AddWord(newWord: Word, callNumber: number, passNumber: number) {
        this.GetPositions(newWord);

        if (newWord.crossingPositions.length + newWord.availablePositions.length > 0) {
            var choice = this.UNSET;
            var newPos: Position = { x: 0, y: 0, direction: this.HORIZONTAL, crossingPoint: 0 };

            // CHOOSE A CROSSING POINT POSITION IF
            // THERE IS ONE - OTHERWISE RANDOMLY
            // CHOOSE FROM THE AVAILABLE POSITIONS
            if (newWord.crossingPositions.length > 0) {
                choice = Math.floor(Math.random() * newWord.crossingPositions.length);
                newPos = newWord.crossingPositions[choice];
                newWord.orphaned = false;
            } else if ((callNumber == 0 && passNumber == 1) || passNumber >= this.MAX_PASSES) {
                choice = Math.floor(Math.random() * newWord.availablePositions.length);
                newPos = newWord.availablePositions[choice];
            }

            if (choice != this.UNSET) {
                newWord.posIndex = choice;

                if (newWord.crossingPositions.length > 0) {
                    newWord.chosenPosition = newWord.crossingPositions[newWord.posIndex];
                } else if (newWord.availablePositions.length > 0) {
                    newWord.chosenPosition = newWord.availablePositions[newWord.posIndex];
                }

                // LOOP THROUGH THE WORD PLACING IT IN THE GRID
                for (var count = 0; count < newWord.word.length; count++) {
                    if (newPos.direction == this.HORIZONTAL) {
                        this.Grid[newPos.x + count][newPos.y] = newWord.word.charAt(count);
                    } else if (newPos.direction == this.VERTICAL) {
                        this.Grid[newPos.x][newPos.y + count] = newWord.word.charAt(count);
                    }
                }
            }
        }
    }

    private GetPositions(newWord: Word) {
        for (var x = 0; x < this.Grid.length; x++) {
            for (var y = 0; y < this.Grid[0].length; y++) {
                var newPos = undefined;

                newPos = this.TestPosition(newWord.word, x, y, this.HORIZONTAL);
                if (newPos !== undefined) {
                    if (newPos.crossingPoint > 0) {
                        newWord.crossingPositions.push(newPos);
                    } else {
                        newWord.availablePositions.push(newPos);
                    }
                }
                newPos = this.TestPosition(newWord.word, x, y, this.VERTICAL);
                if (newPos !== undefined) {
                    if (newPos.crossingPoint > 0) {
                        newWord.crossingPositions.push(newPos);
                    } else {
                        newWord.availablePositions.push(newPos);
                    }
                }
            }
        }
    }

    private TestPosition(newWord: string, x: number, y: number, direction: number) {
        var crossingPoint = 0;

        // UNNACCEPTABLE IF THERE IS A LETTER
        // IN THE SQUARE BEFORE THE PROPOSED START
        if (this.CharBeforeFirstLetter(x, y, direction)) return;

        // UNNACCEPTABLE IF THERE IS A LETTER
        // IN THE SQUARE AFTER THE END
        if (this.CharAfterLastLetter(newWord.length, x, y, direction)) return;

        // DEAL WITH HORIZONTAL AND VERTICAL WORD PLACEMENT
        // SEPARATELY
        if (direction == this.HORIZONTAL) {
            // UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
            if (x + newWord.length > this.Grid.length) return;

            for (var count = 0; count < newWord.length; count++) {
                // 4 CHECKS:
                // 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
                //		ON THE PROPOSED PATH OF THIS WORD
                // 2 - UNACCEPTABLE IF THERE IS ANOTHER WORD IN THE
                //		SAME DIRECTION AT THIS POINT
                // 3 - ACCEPTABLE IF THE CHARACTER MATCHES THE
                //		THE CHARACTER IN THIS WORD - ADD
                //		A CROSSING POINT
                // 4 - UNACCEPTABLE IF THERE ARE CHARACTERS
                //		EITHER SIDE OF THIE PROPOSED PATH
                if (this.Grid[x + count][y].length > 0 && this.Grid[x + count][y] != newWord.charAt(count)) {
                    return;
                } else if (this.AnotherWordOnThisLine(x + count, y, direction)) {
                    return;
                } else if (this.Grid[x + count][y] == newWord.charAt(count).toString() && newWord.charAt(count).toString() != this.HEAD_CHAR) {
                    crossingPoint++;
                } else if (this.SidesHaveChars(x + count, y, direction)) {
                    return;
                }
            }
        } else if (direction == this.VERTICAL) {
            // UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
            if (y + newWord.length > this.Grid[0].length) return;
            for (var count = 0; count < newWord.length; count++) {
                // 4 CHECKS:
                // 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
                //		ON THE PROPOSED PATH OF THIS WORD
                // 2 - UNACCEPTABLE IF THERE IS ANOTHER WORD IN THE
                //		SAME DIRECTION AT THIS POINT
                // 3 - ACCEPTABLE IF THE CHARACTER MATCHES THE
                //		THE CHARACTER IN THIS WORD - ADD
                //		A CROSSING POINT
                // 4 - UNACCEPTABLE IF THERE ARE CHARACTERS
                //		EITHER SIDE OF THIE PROPOSED PATH
                if (this.Grid[x][y + count].length > 0 && this.Grid[x][y + count] != newWord.charAt(count)) {
                    return;
                } else if (this.AnotherWordOnThisLine(x, y + count, direction)) {
                    return;
                } else if (this.Grid[x][y + count] == newWord.charAt(count).toString() && newWord.charAt(count).toString() != this.HEAD_CHAR) {
                    crossingPoint++;
                } else if (this.SidesHaveChars(x, y + count, direction)) {
                    return;
                }
            }
        }

        // IF NO PROBLEMS RETURN THE POSITION DETAILS
        return { x, y, direction, crossingPoint };
    }

    private CharBeforeFirstLetter(x: number, y: number, direction: number) {
        var bCharBeforeFirstLetter = false;

        if (direction == this.HORIZONTAL) {
            if (x - 1 >= 0) {
                if (this.Grid[x - 1][y].length > 0) return true;
            }
        } else if (direction == this.VERTICAL) {
            if (y - 1 >= 0) {
                if (this.Grid[x][y - 1].length > 0) return true;
            }
        }

        return bCharBeforeFirstLetter;
    }

    private CharAfterLastLetter(len: number, x: number, y: number, direction: number) {
        var bCharAfterLastLetter = false;

        if (direction == this.HORIZONTAL) {
            if (x + len < this.Grid.length) {
                if (this.Grid[x + len][y].length > 0) return true;
            }
        } else if (direction == this.VERTICAL) {
            if (y + len < this.Grid[0].length) {
                if (this.Grid[x][y + len].length > 0) return true;
            }
        }

        return bCharAfterLastLetter;
    }

    private AnotherWordOnThisLine(x: number, y: number, direction: number) {
        for (var z = 0; z < this.Words.length; z++) {
            if (this.Words[z].chosenPosition != null) {
                if (
                    this.Words[z].chosenPosition!.x == x &&
                    this.Words[z].chosenPosition!.y == y &&
                    this.Words[z].chosenPosition!.direction == direction
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private SidesHaveChars(x: number, y: number, direction: number) {
        var bHasChars = false;

        if (direction == this.HORIZONTAL) {
            if (y - 1 >= 0) {
                if (this.Grid[x][y - 1].length > 0) return true;
            }
            if (y + 1 < this.Grid[0].length) {
                if (this.Grid[x][y + 1].length > 0) return true;
            }
        } else if (direction == this.VERTICAL) {
            if (x - 1 >= 0) {
                if (this.Grid[x - 1][y].length > 0) return true;
            }
            if (x + 1 < this.Grid.length) {
                if (this.Grid[x + 1][y].length > 0) return true;
            }
        }

        return bHasChars;
    }

    private GenerateQuestionGrid() {
        var counter = 1;

        for (var i = 0; i < this.Words.length; i++) {
            if (this.Words[i].posIndex != this.UNSET) {
                if (this.Words[i].crossingPositions.length > 0) {
                    var tmpObj = {
                        x: this.Words[i].crossingPositions[this.Words[i].posIndex].x,
                        y: this.Words[i].crossingPositions[this.Words[i].posIndex].y,
                        d: this.Words[i].crossingPositions[this.Words[i].posIndex].direction,
                        clue: this.Words[i].clue,
                        longClue: this.Words[i].longClue,
                        word: this.Words[i].word,
                        sound: this.Words[i].sound,
                    };
                    this.QuestionList.push(tmpObj);
                } else {
                    var tmpObj = {
                        x: this.Words[i].availablePositions[this.Words[i].posIndex].x,
                        y: this.Words[i].availablePositions[this.Words[i].posIndex].y,
                        d: this.Words[i].availablePositions[this.Words[i].posIndex].direction,
                        // num: 0,
                        clue: this.Words[i].clue,
                        longClue: this.Words[i].longClue,
                        word: this.Words[i].word,
                        sound: this.Words[i].sound,
                    };
                    this.QuestionList.push(tmpObj);
                }
                counter++;
            }
        }

        this.QuestionList = this.SortXwordQuestions(this.QuestionList);

        var counter = 0;
        for (var k = 0; k < this.QuestionList.length; k++) {
            if (this.QuestionGrid[this.QuestionList[k].x][this.QuestionList[k].y].length == 0) {
                counter++;
                this.QuestionGrid[this.QuestionList[k].x][this.QuestionList[k].y] = counter.toString();
                this.QuestionList[k].num = counter;
            } else {
                this.QuestionList[k].num = counter;
            }
        }
    }

    private SortXwordQuestions(lArray: QuestionItem[]) {
        lArray.sort(function (a, b) {
            var bReturn = 1;
            if (a.y < b.y) bReturn = -1;
            if (a.y == b.y && a.x < b.x) bReturn = -1;
            return bReturn;
        });
        return lArray;
    }

    GetQuestionGrid() {
        return this.QuestionGrid;
    }
}
