class Ability {
    public name: string = "";
    public description: string = "";
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description
    }
}

export default class PokemonData {
    public name: string;
    public types: string[];
    public gifUrl: string;
    learnableMoves: string[] = [];
    learnedMoves: string[] = [];
    stats: Object = new Object();
    learnedAbility: string;
    learnableAbilities: string[];

    constructor(name: string, types: string[], gifUrl: string, learnableAbilities: string[]) {
        this.name = name;
        this.types = types;
        this.gifUrl = gifUrl;
        this.learnableAbilities = learnableAbilities;
        this.learnedAbility = this.learnableAbilities[0];
    }

}