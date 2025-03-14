export default class PokemonData {
    public name: string;
    public types: string[];
    public gifUrl: string;
    learnableMoves: string[] = [];
    learnedMoves: string[] = [];
    constructor(name: string, types: string[], gifUrl: string) {
        this.name = name;
        this.types = types;
        this.gifUrl = gifUrl;
    }

}