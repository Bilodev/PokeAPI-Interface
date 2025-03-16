import PokemonData from "../lib/PokemonData";


export const API_URL = "https://pokeapi.co/api/v2/pokemon";
export const API_MOVES_URL = "https://pokeapi.co/api/v2/move";
export const API_ABILITY_URL = "https://pokeapi.co/api/v2/ability";

export const defaultPokemonSquad = [
    Object(),
    Object(),
    Object(),
    Object(),
    Object(),
    Object(),
];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const isSquadEmpty = (pokemonSquad: PokemonData[]) => {
    for (let index = 0; index < pokemonSquad.length; index++)
        if (Object.entries(pokemonSquad[index]).length > 0) return false;
    return true
}

export const readTextFile = (path: string): string[] => {
    let lines: string[] = [];
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false); //user variable here
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                lines = allText.split("\n"); //split by line break and add to array
            }
        }
    };
    rawFile.send(null);
    return lines;
}

export const saveSquad = (pokemonSquad: PokemonData[], index: number) => {
    localStorage.setItem(`Squad${index}`, btoa(JSON.stringify(pokemonSquad)));
};
