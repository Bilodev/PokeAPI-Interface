<script lang="ts">
  let {
    handlePokeballClick,
    index,
    setSwapped1,
    setSwapped2,
    swapPokemons,
    isSwapAlreadyHappened,
  } = $props();
</script>

<main>
  <img
    ondragstart={() => {
      setSwapped1(index);
    }}
    ondragenter={() => {
      if (isSwapAlreadyHappened ) return;

      setSwapped2(index);
      swapPokemons();
    }}
    onclick={() => {
      handlePokeballClick(index);
    }}
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png"
    alt="pokeball"
  />
</main>

<style>
  img {
    cursor: pointer;
    width: 130px;
    height: 130px;
  }
</style>
