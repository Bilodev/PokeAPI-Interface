<script lang="ts">
  import axios from "axios";
  import MoveData from "./MoveData";
  import { API_ABILITY_URL, API_MOVES_URL, capitalize } from "../utils/utils";

  let { pokemonData, replaceMove, replaceAbility } = $props();
  let moves: MoveData[] = $state([]);
  let showAllMoves = $state(false);
  let showAllAbilities = $state(false);
  pokemonData.learnableMoves.sort();
  const loadMoves = async () => {
    moves = [];
    for (const moveName of pokemonData.learnedMoves) {
      const response = await axios
        .get(`${API_MOVES_URL}/${moveName.toLowerCase()}`)
        .catch((error) => error.response);

      if (response.status == 404) continue;

      const data = response.data;
      let desc: string = "";
      data.flavor_text_entries.some((descObj: any) => {
        if (
          descObj.language.name === "en" &&
          descObj.version_group.name === "lets-go-pikachu-lets-go-eevee"
        ) {
          desc = descObj.flavor_text;
          return true;
        }
      });

      const move = new MoveData(
        moveName,
        data.type.name,
        data.power,
        data.accuracy,
        data.pp,
        data.damage_class.name,
        desc
      );

      moves = [...moves, move];
    }
  };
  setTimeout(() => {
    loadMoves();
    loadLearnedAbility(pokemonData.learnedAbility);
  }, 0);

  let showMoveInfoIndex = $state(-1);
  let showAbilityInfo = $state(false);
  let selectedMove = $state(-1);
  let newMoveName: string = $state("");
  let newAbilityName: string = $state("");
  let selectMoveElement: HTMLSelectElement; // Aggiungi una variabile per riferirsi al select
  let selectAbilityElement: HTMLSelectElement; // Aggiungi una variabile per riferirsi al select

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
      selectMoveElement?.focus(); // Focus sull'elemento select
    }, 1); // Ritardo per garantire che l'elemento sia visibile prima di focalizzarlo
  };

  const handleAbilityClick = () => {
    showAllAbilities = true;
    setTimeout(() => {
      selectAbilityElement?.focus(); // Focus sull'elemento select
    }, 1); // Ritardo per garantire che l'elemento sia visibile prima di focalizzarlo
  };

  const handleAbilitiesSelectClick = () => {
    if (newAbilityName == pokemonData.learnedAbility) return;
    loadLearnedAbility(newAbilityName);
    pokemonData.learnedAbility = newAbilityName;
    showAllAbilities = false;
    newAbilityName = "";
    replaceAbility(pokemonData.name, pokemonData.learnedAbility);
  };

  let learnedAbilityDescription = $state("");
  const loadLearnedAbility = async (abilityName: string) => {
    const response = await axios
      .get(`${API_ABILITY_URL}/${abilityName.toLowerCase()}`)
      .catch((error) => error.response);
    console.log(response.data);
    let desc: string = "No Description Provided";
    response.data.flavor_text_entries.some((descObj: any) => {
      if (
        descObj.language.name === "en" &&
        descObj.version_group.name === "lets-go-pikachu-lets-go-eevee"
      ) {
        desc = descObj.flavor_text;
        return true;
      }
    });

    learnedAbilityDescription = desc;
  };
</script>

<main>
  <div class="pokemonContainer">
    <center>
      <img class="pokemonGif" src={pokemonData.gifUrl} alt={pokemonData.name} />
      <div class="pokemonInfo">
        <div class="nameContainer">
          <p id="pokemonName">{pokemonData.name}</p>
        </div>
        <div class="typesContainer">
          {#each pokemonData.types as type}
            <type id="pokemonType" name={type.type.name}>{type.type.name}</type>
          {/each}
        </div>
      </div>
    </center>
  </div>
  <center>
    <button
      class="abilityButton"
      onclick={() => {
        showAbilityInfo = false;
        showAllAbilities = true;
        handleAbilityClick();
      }}
      onmouseenter={() => {
        if (showAllAbilities) return;
        showAbilityInfo = true;
      }}
      onmouseleave={() => {
        showAbilityInfo = false;
      }}
    >
      <p style="text-transform: capitalize; cursor:pointer">
        Ability: {pokemonData.learnedAbility}
      </p>
    </button>
    <p id="abilityDesc">{learnedAbilityDescription}</p>
    <br />
    <select
      class="selectAbility"
      bind:this={selectAbilityElement}
      hidden={!showAllAbilities}
      bind:value={newAbilityName}
      onblur={() => {
        newAbilityName = "";
        showAllAbilities = false;
      }}
      onchange={() => {
        handleAbilitiesSelectClick();
      }}
    >
      {#each pokemonData.learnableAbilities as ability}
        <option value={ability}>{capitalize(ability)}</option>
      {/each}
    </select>
  </center>
  <div class="moves">
    <div class="movesContainer">
      {#each moves as move, index}
        <move
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
          name={move.type}>{move.name.replaceAll("-", " ")}</move
        >
      {/each}
    </div>
  </div>
  <br />
  <center>
    <select
      bind:this={selectMoveElement}
      class="moveSelect"
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
  </center>
  <center>
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
                width="30"
                height="30"
                src="https://img.icons8.com/color/48/flash-bang.png"
                alt="flash-bang"
              />
            {:else if moves[showMoveInfoIndex].atkType == "special"}
              <img
                id="atkType"
                width="30"
                height="30"
                src="https://img.pokemondb.net/images/icons/move-special.png"
                alt="Special Move"
              />
            {:else}
              <img
                width="20"
                height="20"
                src="https://img.pokemondb.net/images/icons/move-status.png"
                alt="Status Move"
              />
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </center>

  <div class="statsContainer">
    <center>
      {#each Object.entries(pokemonData.stats) as [name, value]}
        <div class="progressLabel">{name}:{value}</div>
        <progress {value} max="200"></progress>
      {/each}
      <br />
      Total: {Object.entries(pokemonData.stats).reduce(
        (partialSum, statValue) => partialSum + statValue[1],
        0
      )}
    </center>
  </div>
</main>

<style>
  .selectAbility {
    position: relative;
    top: -30px;
    margin-bottom: 20px;
  }
  #abilityDesc {
    margin-top: -10px;
    font-size: 1.1rem;
    max-width: 20rem;
  }
  .statsContainer {
    display: flex;
    position: relative;
    margin-top: 50px;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 5rem;
  }
  img {
    scale: (5);
    margin-left: 10px;
  }
  option {
    text-transform: capitalize;
  }

  progress {
    height: 2.5vh;
    width: 15%;
    margin-left: 20px;
  }

  .pokemonGif {
    transform: scale(2.5);
  }

  #pokemonName {
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 80px;
    text-transform: capitalize;
  }
  .typesContainer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  type {
    margin-right: 10px;
    margin-left: 10px;
    padding: 10px 10px;
    font-weight: bold;
    width: 8rem;
    border: none;
    border-radius: 3px;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  .movesContainer {
    display: grid;
    grid-template-columns: repeat(2, 13rem);
    flex-wrap: wrap;
    gap: 2rem;
  }
  move {
    width: 10rem;
    font-weight: bold;
    text-transform: uppercase;
    padding: 20px 20px;
    border-radius: 5px;
    text-align: center;
  }

  .moves {
    max-width: fit-content;
    margin-inline: auto;
  }

  .abilityButton {
    outline: none;
    background-color: transparent;
    border: none;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .moveInfo {
    display: flex;
    justify-content: space-between; /* Aligns the description and GIF side by side */
    align-items: flex-start;
    margin-top: 40px;
    width: 100%; /* Ensure the container takes the full width */
  }

  .moveInfoContainer {
    background-color: whitesmoke;
    color: black;
    font-weight: bold;
    border-radius: 10px;
    width: auto;
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;
    font-size: 0.9rem;
    max-width: 30%;
    margin-inline: auto;

    p {
      margin-left: 10px;
      text-transform: capitalize;
    }
  }

  .otherInfo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  #description {
    font-size: 1.3rem;
  }
</style>
