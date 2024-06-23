<script>
  import svgRight from './assets/right.svg'

  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher();

  const onCheck = () => {
    dispatch('check')
  }

  export let checked
</script>

<div class="check" on:click={onCheck}>
  {#if checked}
    <img src={svgRight} />
  {/if}
</div>

<style lang="scss">
  .check {
    height: 18px;
    width: 18px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(0, 0, 0, 0.12);
    }
  }
</style>
