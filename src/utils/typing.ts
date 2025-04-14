import { xml2json } from "./xml2json";

export interface Clue {
    clue: string;
    clue_check: string;
    longClue: string;
    origin_longClue: string;
    word: string;
    word_view: string;
    sound: string;
    keyboard?: string[];
}

interface CrossPuzzle {
    clues: Clue[];
}

interface TypingData {
    cross_puzzle: CrossPuzzle;
}

export const Typing = {
    data: null as TypingData | null,
    count: 0,
    clue: null as Clue | null,
    round1_xml_data: null as string | null,
    round2_xml_data: null as string | null,

    // 타이핑 데이터 취합
    setData: function (xml_data: string) {
        this.data = JSON.parse(xml2json(xml_data));

        // sound 위치 설정
        if (this.data?.cross_puzzle?.clues) {
            this.data.cross_puzzle.clues.forEach((clue) => {
                clue.sound = `https://cdn.littlefox.co.kr/contents/vocab/${clue.sound.substring(0, 1)}/${clue.sound}`;
            });

            // 무작위 순서로 섞기
            this.data.cross_puzzle.clues.sort(() => Math.random() - 0.5);
        }
    },

    round1_xml: function (xml_data: string) {
        this.round1_xml_data = xml_data;
    },

    round2_xml: function (xml_data: string) {
        this.round2_xml_data = xml_data;
    },

    // 현재 타이핑 정보 가져오기
    getWord: function () {
        if (!this.data?.cross_puzzle?.clues) return null;

        const clues = this.data.cross_puzzle.clues;
        const clue = clues[this.count];

        if (clue) {
            clue.keyboard = this.keyboard(clue.word);
            this.count++;
            this.clue = clue;
        }

        return clue;
    },

    // 키보드 설정
    keyboard: function (word: string): string[] {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const keyboard_array: string[] = [];

        // 단어의 문자 먼저 추가
        for (const char of word) {
            if (alphabet.includes(char) && !keyboard_array.includes(char)) {
                keyboard_array.push(char);
            }
        }

        // 남은 키보드 배열 채우기
        while (keyboard_array.length < 17) {
            const remainingAlphabet = alphabet.split("").filter((char) => !keyboard_array.includes(char));

            if (remainingAlphabet.length === 0) break;

            const randomChar = remainingAlphabet[Math.floor(Math.random() * remainingAlphabet.length)];
            keyboard_array.push(randomChar);
        }

        // 무작위로 섞기
        return keyboard_array.sort(() => Math.random() - 0.5);
    },
};

export default Typing;
