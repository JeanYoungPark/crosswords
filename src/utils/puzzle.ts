import Typing from "./typing";
import CrosswordWorker from "../workers/crosswordWorker?worker";

interface GridCell {
    word_h_idx: number;
    word_v_idx: number;
    char: string;
    char_h_idx: number;
    char_v_idx: number;
    mode: "disabled" | "input" | "blank" | "correct";
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
    keyboard?: string[];
    mode?: string;
    item?: string;
}

export class Puzzle {
    public HORIZONTAL_BOXES = 18; // 가로 블록 수
    public VERTICAL_BOXES = 13; // 세로 블록 수
    public grid: GridCell[][] = [];
    public list: QuestionItem[] = [];
    public selected: QuestionItem | null = null;
    public focus: GridCell | null = null;

    private max_cross = 15; // 최대 문제수
    private min_cross = 4; // 최소 문제수
    private repeat_limit = 3; // min_corss 이하일때 반복 횟수
    private repeat_count = 0;

    // 데이터 취합
    public setData() {
        return new Promise<void>((resolve) => {
            this.grid = [];
            this.list = [];
            this.focus = null;
            this.selected = null;

            var data = Typing.data?.cross_puzzle.clues.slice();
            var cross_data = [];

            if (!data) return;

            this.max_cross = this.max_cross < data.length ? this.max_cross : data.length;

            for (var i = 0; i < this.max_cross; i++) {
                var rnd = Math.floor(Math.random() * data.length);
                cross_data.push(data[rnd]);
                data.splice(rnd, 1);
            }

            const worker = new CrosswordWorker();
            worker.postMessage({
                width: this.HORIZONTAL_BOXES,
                height: this.VERTICAL_BOXES,
                clues: cross_data,
            });

            worker.onmessage = (e) => {
                const { questionList } = e.data;

                this.list = questionList;
                worker.terminate();

                this.repeat_count++;
                if (this.list.length < this.min_cross && this.repeat_count < this.repeat_limit) {
                    this.setData();
                    resolve();
                } else {
                    this.setGrid();
                    resolve();
                }
            };
        });
    }

    // 퍼즐 만들기
    private setGrid() {
        // 초기화
        for (let i = 0; i < this.HORIZONTAL_BOXES; i++) {
            var v_array: GridCell[] = [];
            for (let j = 0; j < this.VERTICAL_BOXES; j++) {
                v_array.push({
                    word_h_idx: -1,
                    word_v_idx: -1,
                    char: "",
                    char_h_idx: -1,
                    char_v_idx: -1,
                    mode: "disabled",
                });
            }
            this.grid.push(v_array);
        }

        // 가운데 정렬
        var min_x = this.HORIZONTAL_BOXES;
        var max_x = 0;
        var min_y = this.VERTICAL_BOXES;
        var max_y = 0;

        for (let i = 0; i < this.list.length; i++) {
            var puzzle = this.list[i];
            if (puzzle.d == 1) {
                min_x = Math.min(puzzle.x, min_x);
                max_x = Math.max(puzzle.x + puzzle.word.length, max_x);
                min_y = Math.min(puzzle.y, min_y);
                max_y = Math.max(puzzle.y, max_y);
            } else {
                min_x = Math.min(puzzle.x, min_x);
                max_x = Math.max(puzzle.x, max_x);
                min_y = Math.min(puzzle.y, min_y);
                max_y = Math.max(puzzle.y + puzzle.word.length, max_y);
            }
        }

        var adjust_x = Math.floor((min_x + (this.HORIZONTAL_BOXES - max_x)) / 2) - min_x;
        var adjust_y = Math.floor((min_y + (this.VERTICAL_BOXES - max_y)) / 2) - min_y;

        // 데이터 입력
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].x += adjust_x;
            this.list[i].y += adjust_y;
            var puzzle = this.list[i];

            this.list[i].keyboard = this.keyboard(puzzle.word);
            this.list[i].mode = "input";
            this.list[i].item = "";

            for (let j = 0; j < puzzle.word.length; j++) {
                var char = puzzle.word.substring(j, j + 1);
                if (puzzle.d == 1) {
                    this.grid[puzzle.x + j][puzzle.y].word_h_idx = i;
                    this.grid[puzzle.x + j][puzzle.y].mode = char != " " ? "input" : "blank";
                    this.grid[puzzle.x + j][puzzle.y].char = char;
                    this.grid[puzzle.x + j][puzzle.y].char_h_idx = j;
                } else {
                    this.grid[puzzle.x][puzzle.y + j].word_v_idx = i;
                    this.grid[puzzle.x][puzzle.y + j].mode = char != " " ? "input" : "blank";
                    this.grid[puzzle.x][puzzle.y + j].char = char;
                    this.grid[puzzle.x][puzzle.y + j].char_v_idx = j;
                }
            }
        }
    }

    // 현재 선택 항목 설정
    public setFocusXY(x: number, y: number) {
        this.focus = this.grid[x][y];
    }

    // 현재 선택 항목 인덱스 설정
    public setPuzzleIdx(idx: number) {
        this.selected = this.list[idx];
    }

    // 사용가능한 키보드 만들기
    private keyboard(word: string) {
        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        var keyboard_array = [];
        var ii = 0;

        for (var i = 0; i < word.length; i++) {
            if (alphabet.indexOf(word[i]) > -1) {
                keyboard_array[ii] = word[i];
                alphabet = alphabet.replace(word[i], "");
                ii++;
            }
        }

        for (var i = keyboard_array.length; i < 17; i++) {
            var a_idx = Math.floor(Math.random() * alphabet.length);
            keyboard_array[i] = alphabet[a_idx];
            alphabet = alphabet.replace(alphabet[a_idx], "");
        }

        keyboard_array.sort(function (a, b) {
            return Math.random() - 0.5;
        });
        return keyboard_array;
    }

    // 현재 모드 설정
    public setMode(x: number, y: number, idx: number, mode: "disabled" | "input" | "blank" | "correct") {
        this.grid[x][y].mode = mode;
        this.list[idx].mode = mode;
    }

    // 정답 체크
    public correctAllCheck() {
        return this.list.every((list) => list.mode === "correct");
    }

    // 오답 체크
    private incorrectCount() {
        var incorrect_count = 0;
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].mode == "input") incorrect_count++;
        }

        return incorrect_count;
    }

    // 짧은 설명 가져오기
    // public clueShort(idx: number) {
    //     var clue = this.num_chars.substring(idx, idx + 1) + " " + this.list[idx].clue;
    //     return clue.length > 25 ? clue.substring(0, 25) + "..." : clue;
    // }

    // 퍼즐 데이터 설정
    public setItem(x: number, y: number, d: number, item: string) {
        const h_idx = d === 1 ? this.grid[x][y].word_h_idx : -1;
        const v_idx = d !== 1 ? this.grid[x][y].word_v_idx : -1;

        if (h_idx >= 0) {
            if (item == "showaletter" && this.list[h_idx].item == "") {
                this.list[h_idx].item = item + "1";
            } else {
                this.list[h_idx].item = item;
            }
        }

        if (v_idx >= 0) {
            if (item == "showaletter" && this.list[v_idx].item == "") {
                this.list[v_idx].item = item + "1";
            } else {
                this.list[v_idx].item = item;
            }
        }
    }
}
