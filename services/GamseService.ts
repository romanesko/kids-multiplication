import {Cell} from "../components/Table";
import Toast from "react-native-toast-message";
import {toastSettings} from "../common/ToastConfig";

function randomInt(max) {
    return Math.floor(Math.random() * max);
}
export const getRandomCell = (source): Cell => {
    return [...source][Math.floor(Math.random() * source.size)] as Cell;
}

export class GameService{
    get gameStarted(): boolean {
        return this._gameStarted;
    }
    private _gameStarted: boolean;
    get currentQuestion(): Cell {
        return this._currentQuestion;
    }
    get lastAnswerState(): string {
        return this._lastAnswerState;
    }
    get proposedVariants(): Cell[] {
        return this._proposedVariants;
    }

    set proposedVariants(value: Cell[]) {
        this._proposedVariants = value;
    }
    private _currentQuestion: Cell;
    private _lastAnswerState: string;
    private _proposedVariants: Cell[];
    get unopenedVariants(): Set<Cell> {
        return this._unopenedVariants;
    }
    private _unopenedVariants: Set<Cell>;
    get allVariants(): Set<Cell> {
        return this._allVariants;
    }
    private _allVariants: Set<Cell>;

    get opened(): Set<Cell> {
        return this._opened;
    }
    private _opened: Set<Cell>;
    get variantsCount(): number {
        return this._variantsCount;
    }
    private _variantsCount: number;

    get level(): number {
        return this._level;
    }

    get counters(): { nok: number; ok: number } {
        return this._counters;
    }

    get maxNumber(): number {
        return this._maxNumber;
    }
    private _level: number;
    private _counters: { nok: number; ok: number };
    private _maxNumber: number;

    constructor() {
    }

    public startNewGame(level: number) {
        this._level = level;
        this._counters = {ok:0,nok:0}
        this._maxNumber = level;
        this._variantsCount = (this._maxNumber - 1) ** 2
        this._opened = new Set<Cell>()

        const variants = new Set<Cell>();
        for (let x of [...Array(this._maxNumber).keys()].slice(1)) {
            for (let y of [...Array(this._maxNumber).keys()].slice(1)) {
                variants.add(new Cell(x + 1, y + 1));
            }
        }
        this._allVariants = variants;
        this._unopenedVariants = variants;
        this._gameStarted = true;


    }

    public getNextQuestion (): Cell  {
        this._lastAnswerState = null;
        const cell = getRandomCell(this.unopenedVariants);

        if (this.opened.size >= this.variantsCount) {
            console.log('next: no more')
            return;
        }

        for (let o of this.opened) {
            if (o.equals(cell)) {
                return this.getNextQuestion();
            }
        }
        this._currentQuestion = cell;
        this.generateRandomVariants()
        return cell;
    }


    private generateRandomVariants() {

        const correct = this._currentQuestion.multiply();

        const randomPos = randomInt(3);

        const variants = []

        let i = 0;

        let source = (this.unopenedVariants.size > 3) ? this.unopenedVariants : this.allVariants;

        while (variants.length < 3) {
            i++;
            if (i > 10) {
                source = this.allVariants;
            }
            if (i > 100) {
                console.log('too many attempts')
                break
            }
            const variant = getRandomCell((this.unopenedVariants.size > 3) ? this.unopenedVariants : this.allVariants);
            if (variant.multiply() == correct) continue;
            if (variants.includes(variant.multiply())) continue;
            variants.push(variant.multiply());
            i = 0;
        }
        variants[randomPos] = correct;
        //
        this._proposedVariants =  variants.sort((a, b) => a - b);
    }

    checkAnswer(answer: number) {
        if (answer == this._currentQuestion.multiply()) {
            this._lastAnswerState = 'CORRECT'
            this.opened.add(this._currentQuestion);
            this._counters.ok++;
            return true;
        }

        this._lastAnswerState = 'INCORRECT'
        this._counters.nok++;
        return false;
    }

    stop() {
        this._gameStarted = false;
    }
}


