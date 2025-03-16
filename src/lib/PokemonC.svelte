<script lang="ts">
  let {
    pokemonData,
    removePokemon,
    index,
    changeSelectedPokemon,
    setMovesMode,
    canSwitch,
    setSwapped1,
    setSwapped2,
    swapPokemons,
    isSwapAlreadyHappened,
  } = $props();
</script>

<main>
  <div class="pokemonContainer">
    <center>
      <button
        onclick={() => {
          if (!canSwitch) return;
          changeSelectedPokemon(index);
          setMovesMode();
        }}
        class="pokemonButton"
      >
        <img
          ondragstart={() => {
            setSwapped1(index);
          }}
          ondragenter={() => {
            if (isSwapAlreadyHappened) return
            setSwapped2(index);
            swapPokemons();
          }}
          class="pokemonGif"
          src={pokemonData.gifUrl}
          alt={pokemonData.name}
        />
      </button>
      <div class="pokemonInfo">
        <div class="nameContainer">
          <p
            id="pokemonName"
            onclick={() => {
              removePokemon(index);
            }}
          >
            {pokemonData.name}
          </p>
        </div>
        <div class="typesContainer">
          {#each pokemonData.types as type}
            <type name={type.type.name}>{type.type.name}</type>
          {/each}
        </div>
      </div>
    </center>
  </div>
</main>

<style>
  .pokemonContainer {
    position: relative;
    margin-bottom: 70px;
  }

  .pokemonButton {
    background-color: transparent;
    border: none;
  }

  img {
    margin-bottom: 40px;
    height: auto;
    cursor: pointer;
  }

  .pokemonGif {
    transform: scale(2);
    align-self: flex-end;
  }

  .pokemonInfo {
    margin-top: 20px;
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
    font-size: 1.2rem;
    cursor: url("https://img.icons8.com/000000/small/16/filled-trash.png"),
      pointer;
  }

  .typesContainer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  type {
    margin: 5px;
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 3px;
    text-transform: uppercase;
  }
</style>
