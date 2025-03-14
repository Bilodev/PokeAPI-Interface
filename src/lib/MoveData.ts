export default class MoveData {
    name: string;
    type: string;
    power: number;
    accuracy: number;
    pp: number;
    atkType: string;
    description: string
    constructor(name: string, type: string, power: number, accuracy: number, pp: number, atkType: string, description: string) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
        this.atkType = atkType;
        this.description = description;
    }
}