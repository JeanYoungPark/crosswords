// crossword-worker.ts
import { XWords } from "../utils/crosswords";

self.onmessage = (event) => {
    const { height, width, clues } = event.data;
    const xWords = new XWords();
    xWords.create(height, width, clues);
    xWords.GetQuestionGrid();

    const result = {
        questionList: xWords.QuestionList,
    };

    postMessage(result);
};
