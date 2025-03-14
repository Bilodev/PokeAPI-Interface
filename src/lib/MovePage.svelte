<script lang="ts">
  import axios from "axios";
  import MoveData from "./MoveData";
  import { API_MOVES_URL } from "../utils/utils";

  let { pokemonData, replaceMove } = $props();
  let moves: MoveData[] = $state([]);
  let showAllMoves = $state(false);
  pokemonData.learnableMoves.sort()
  const loadMoves = async () => {
    moves = [];
    for (const moveName of pokemonData.learnedMoves) {
      const response = await axios
        .get(`${API_MOVES_URL}/${moveName.toLowerCase()}`)
        .catch((error) => error.response);

      if (response.status == 404) continue;

      const data = response.data;

      const move = new MoveData(
        moveName,
        data.type.name,
        data.power,
        data.accuracy,
        data.pp,
        data.damage_class.name,
        data.flavor_text_entries[2]?.flavor_text
      );

      moves = [...moves, move];
    }
  };
  setTimeout(() => {
    loadMoves();
  }, 0);

  let showMoveInfoIndex = $state(-1);
  let selectedMove = $state(-1);
  let newMoveName: string = $state("");
  let selectElement: HTMLSelectElement; // Aggiungi una variabile per riferirsi al select

  const handleSelectClick = async () => {
    if (pokemonData.learnedMoves.includes(newMoveName)) return;
    for (let index = 0; index < pokemonData.learnedMoves.length; index++) {
      if (pokemonData.learnedMoves[index] == moves[selectedMove].name)
        pokemonData.learnedMoves[index] = newMoveName;
    }
    showAllMoves = false;
    newMoveName = "";
    await loadMoves();
    replaceMove(pokemonData.name, pokemonData.learnedMoves);
  };

  const handleMoveClick = () => {
    showAllMoves = true;
    setTimeout(() => {
      selectElement?.focus(); // Focus sull'elemento select
    }, 1); // Ritardo per garantire che l'elemento sia visibile prima di focalizzarlo
  };
</script>

<main>
  <div class="pokemonContainer">
    <center>
      <button class="pokemonButton">
        <img
          class="pokemonGif"
          src={pokemonData.gifUrl}
          alt={pokemonData.name}
        />
      </button>
      <div class="pokemonInfo">
        <div class="nameContainer">
          <p id="pokemonName">{pokemonData.name}</p>
        </div>
        <div class="typesContainer">
          {#each pokemonData.types as type}
            <type name={type.type.name}>{type.type.name}</type>
          {/each}
        </div>
      </div>
    </center>
  </div>
  <div class="moves">
    <div class="movesContainer">
      {#each moves as move, index}
        <type
          onmouseenter={() => {
            showMoveInfoIndex = index;
          }}
          onclick={() => {
            selectedMove = showMoveInfoIndex;
            showMoveInfoIndex = -1;
            handleMoveClick(); // Focalizza il select quando si clicca sulla mossa
          }}
          onmouseleave={() => {
            showMoveInfoIndex = -1;
          }}
          style="cursor: pointer;"
          name={move.type}>{move.name.replaceAll("-", " ")}</type
        >
      {/each}
    </div>
  </div>
  {#if moves.length && showMoveInfoIndex != -1 && !showAllMoves}
    <div class="moveInfo">
      <div class="moveInfoContainer">
        <p id="description">
          {moves[showMoveInfoIndex].description || "No description provided"}
        </p>
        <div class="otherInfo">
          <p>Type: {moves[showMoveInfoIndex].type}</p>
          <p hidden={!moves[showMoveInfoIndex].power}>
            Power: {moves[showMoveInfoIndex].power}
          </p>
          <p hidden={!moves[showMoveInfoIndex].accuracy}>
            Accuracy: {moves[showMoveInfoIndex].accuracy}
          </p>
          <p>PP: {moves[showMoveInfoIndex].pp}</p>
          {#if moves[showMoveInfoIndex].atkType == "physical"}
            <img
              id="atkType"
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/flash-bang.png"
              alt="flash-bang"
            />
          {:else if moves[showMoveInfoIndex].atkType == "special"}
            <img
              id="atkType"
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/nebula.png"
              alt="nebula"
            />
          {/if}
        </div>
      </div>
    </div>
    {/if}
    <select
      bind:this={selectElement}
      name=""
      id=""
      hidden={!showAllMoves}
      bind:value={newMoveName}
      onblur={() => {
        selectedMove = -1;
        newMoveName = "";
        showAllMoves = false;
      }}
      onchange={() => {
        handleSelectClick();
      }}
    >
      {#each pokemonData.learnableMoves as move}
        <option value={move}>{move}</option>
      {/each}
    </select>
</main>

<style>
  select {
    position: relative;
    margin-top: 0px;
    width: 20%;
    font-size: 16px;
    margin-left: 61%;
    z-index: 10;
    height: 25px;
  }

  .movesContainer {
    position: relative;
    margin-top: -280px;
    margin-left: 60%;
    display: grid;
    grid-template-columns: repeat(2, 0.1fr);
    grid-gap: 10px;
  }

  .moveInfo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
    margin-bottom: 60px;
  }

  .otherInfo {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
  }
  p {
    margin: 10px;
    text-transform: capitalize;
  }

  #description {
    margin-top: 30px;
    font-size: 1.5rem;
    margin-left: 10px;
  }

  .moveInfoContainer {
    background-color: whitesmoke;
    color: black;
    font-weight: bold;
    width: auto;
    margin-top: 40px;
    border-radius: 10px;
  }

  .pokemonContainer {
    position: relative;
    margin-top: 0%;
    right: 20%;
  }

  .pokemonButton {
    background-color: transparent;
    border: none;
  }

  .pokemonGif {
    margin-bottom: 40px;
    height: auto;
    transform: scale(3);
    align-self: flex-end;
  }

  .pokemonInfo {
    margin-top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nameContainer {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  #pokemonName {
    text-align: center;
    text-transform: capitalize;
    margin: 10px 0;
    font-weight: bold;
    font-size: 1.3rem;
  }

  .typesContainer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  type {
    margin: 10px;
    padding: 10px 15px;
    font-weight: bold;
    border-radius: 3px;
    text-transform: uppercase;
    font-size: 1rem;
    width: 10rem;
    border: 1.5px solid black;
  }
</style>
