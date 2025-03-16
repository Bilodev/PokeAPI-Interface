<script lang="ts">
  import axios from "axios";

  import Pokeball from "./lib/PokeballC.svelte";
  import PokemonC from "./lib/PokemonC.svelte";
  import PokemonData from "./lib/PokemonData.ts";
  import {
    capitalize,
    defaultPokemonSquad,
    readTextFile,
    API_URL,
    saveSquad,
    isSquadEmpty,
  } from "./utils/utils.ts";
  import MovePage from "./lib/MovePage.svelte";

  let everyPokemonName: string[];
  let inputMatchingPokemons: string[];
  let pokemonSquad: PokemonData[] = [...defaultPokemonSquad];
  let currentSquad = 1;

  onload = () => {
    const squad = localStorage.getItem(`Squad${currentSquad}`);
    if (squad) pokemonSquad = JSON.parse(atob(squad));
    everyPokemonName = readTextFile("./src/pokemons.txt");
  };

  let selectVisibility: boolean = false;
  let searchBarVisibility: boolean = false;
  let selectedPokemonIndex: number = 0;

  const handlePokeballClick = (index: number) => {
    searchBarVisibility = true;
    selectedPokemonIndex = index;
    setTimeout(() => {
      document.querySelector("input")?.focus();
    }, 0);
  };

  let pokemonSearchName: string = "";
  let toAddPokemonName: string = "";

  const handleSearch = (e: Event) => {
    if (!pokemonSearchName.length) {
      selectVisibility = false;
      return;
    }

    if (
      e.key === "Enter" &&
      everyPokemonName.indexOf(capitalize(pokemonSearchName.toLowerCase())) != -1
    ) {
      toAddPokemonName = pokemonSearchName;
      return handleSelectClick();
    }

    inputMatchingPokemons = everyPokemonName.filter((name: string) =>
      name.toLowerCase().startsWith(pokemonSearchName.toLowerCase())
    );
    selectVisibility = inputMatchingPokemons.length != 0;
  };

  const handleSelectClick = async () => {
    searchBarVisibility = false;
    selectVisibility = false;
    const response = await axios
      .get(`${API_URL}/${toAddPokemonName.toLowerCase()}`)
      .catch((error) => error.response);
    if (response.status == 404) return;

    let abilities: string[] = [];
    for (let index = 0; index < response.data.abilities.length; index++) {
      abilities.push(response.data.abilities[index].ability.name);
    }
    const pokemon = new PokemonData(
      response.data.name,
      response.data.types,
      response.data.sprites.versions["generation-v"][
        "black-white"
      ].animated.front_default,
      abilities
    );

    response.data.moves.forEach((element: any) => {
      pokemon.learnableMoves.push(element.move.name);
    });
    pokemon.stats = {
      HP: response.data.stats[0].base_stat,
      Attack: response.data.stats[1].base_stat,
      Defense: response.data.stats[2].base_stat,
      "Sp.Attack": response.data.stats[3].base_stat,
      "Sp.Defense": response.data.stats[4].base_stat,
      Speed: response.data.stats[5].base_stat,
    };
    pokemon.learnedMoves = pokemon.learnableMoves.slice(0, 4);
    pokemonSquad[selectedPokemonIndex] = pokemon;
    pokemonSearchName = "";
    toAddPokemonName = "";
    saveSquad(pokemonSquad, currentSquad);
  };

  const removePokemon = (index: number) => {
    pokemonSquad[index] = Object();
    saveSquad(pokemonSquad, currentSquad);
  };

  let visual_mode: string = "Squad";
  let selectedPokemonIndexForMoves = 0;

  const changeSelectedPokemon = (index: number) => {
    selectedPokemonIndexForMoves = index;
  };
  const setMovesMode = () => {
    visual_mode = "Moves";
  };

  const replaceMove = (name: string, newMoves: string[]) => {
    for (let index = 0; index < pokemonSquad.length; index++) {
      if (pokemonSquad[index].name === name)
        pokemonSquad[index].learnedMoves = newMoves;
      saveSquad(pokemonSquad, currentSquad);
    }
  };
  const replaceAbility = (name: string, newAbility: string) => {
    for (let index = 0; index < pokemonSquad.length; index++) {
      if (pokemonSquad[index].name === name)
        pokemonSquad[index].learnedAbility = newAbility;
      saveSquad(pokemonSquad, currentSquad);
    }
  };

  const changeSquad = () => {
    const squad = localStorage.getItem(`Squad${currentSquad}`);
    if (!squad) {
      pokemonSquad = defaultPokemonSquad;
      return;
    }
    pokemonSquad = JSON.parse(atob(squad));
    everyPokemonName = readTextFile("./src/pokemons.txt");
  };

  let swapped1: number, swapped2: number;
  const setSwapped1 = (index: number) => {
    swapped1 = index;
  };
  const setSwapped2 = (index: number) => {
    swapped2 = index;
  };
  const swapPokemons = () => {
    if (swapped1 == swapped2) return;
    let t = pokemonSquad[swapped1];
    pokemonSquad[swapped1] = pokemonSquad[swapped2];
    pokemonSquad[swapped2] = t;
    saveSquad(pokemonSquad, currentSquad);
    swapped1 = swapped2 = -1;
  };
</script>

<main>
  <h1>Build Your Pokémon Squad</h1>

  <!-- Clear all button -->
  <center>
    {#if visual_mode == "Squad"}
      <select
        bind:value={currentSquad}
        onchange={() => {
          changeSquad();
        }}
      >
        {#each { length: 10 }, count}
          {#if currentSquad == count + 1}
            <option selected disabled>{count + 1}</option>
          {:else}
            <option value={count + 1}>{count + 1}</option>
          {/if}
        {/each}
      </select>
      <button
        hidden={isSquadEmpty(pokemonSquad)}
        onclick={() => {
          pokemonSquad = [...defaultPokemonSquad];
          saveSquad(defaultPokemonSquad, currentSquad);
        }}>Clear Squad</button
      >
    {:else}
      <button
        onclick={() => {
          visual_mode = "Squad";
        }}>View Squad</button
      >
    {/if}
  </center>

  <br />

  <center>
    <!-- Search Input -->
    <input
      style="color: black "
      type="text"
      placeholder="Select your #{selectedPokemonIndex + 1} Pokémon"
      hidden={!searchBarVisibility}
      bind:value={pokemonSearchName}
      onkeyup={(e: Event) => handleSearch(e)}
      onblur={() => {
        if (!selectVisibility) searchBarVisibility = false;
      }}
    />

    <br />

    <!-- Lista pokemon che corrispondono all'input -->
    <select
      id="myDropdown"
      hidden={!selectVisibility || !inputMatchingPokemons.length}
      bind:value={toAddPokemonName}
      onchange={() => {
        handleSelectClick();
      }}
    >
      {#each inputMatchingPokemons as pokemonName, index}
        {#if index == 0}
          <option selected disabled unselectable="on" value=""
            >Found {inputMatchingPokemons.length} matching pokemons</option
          >
        {/if}
        <option value={pokemonName}> {pokemonName}</option>
      {/each}
    </select>
  </center>

  <br /> <br /><br />

  <!-- Squadra Pokemon -->
  {#if visual_mode == "Squad"}
    <squad>
      {#each pokemonSquad as pokemon, index}
        {#if pokemon?.name && pokemon?.types && pokemon?.gifUrl}
          <PokemonC
            pokemonData={pokemonSquad[index]}
            {index}
            {removePokemon}
            {changeSelectedPokemon}
            {setMovesMode}
            canSwitch={!searchBarVisibility}
            {setSwapped1}
            {setSwapped2}
            {swapPokemons}
            isSwapAlreadyHappened={swapped1 == -1}
          />
        {:else}
          <button class="pokeballButton">
            <Pokeball
              {handlePokeballClick}
              {index}
              {setSwapped1}
              {setSwapped2}
              {swapPokemons}
              isSwapAlreadyHappened={swapped1 == -1}
            />
          </button>
        {/if}
      {/each}
    </squad>
  {:else if visual_mode == "Moves"}
    <MovePage
      pokemonData={pokemonSquad[selectedPokemonIndexForMoves]}
      {replaceMove}
      {replaceAbility}
    />
  {/if}
</main>
