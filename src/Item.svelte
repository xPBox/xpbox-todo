<script>
  import {createEventDispatcher} from 'svelte'
  import Check from './Check.svelte'
  import svgClose from './assets/close.svg'

  const dispatch = createEventDispatcher()

  function onDel() {
    dispatch('delete', item.id)
  }

  function onCheck() {
    dispatch('check', item.id)
  }

  export let item
  export let deleted
</script>
<div class="item" class:deleted on:click>
  <div class="main">
    <Check class="check" on:check={onCheck} checked={deleted}/>
    <div class="title ellipsis">
      {item?.title}
    </div>
    <div class="close" on:click={onDel}>
      <img src={svgClose} height="16" width="16"/>
    </div>
  </div>
  {#if item?.desc}
    <div class="extra">
      {item?.desc}
    </div>
  {/if}
</div>

<style lang="scss">
  .item {
    background: #BBBBBB20;
    border-radius: 16px;
    width: 100%;
    padding: 10px 16px 10px 10px;
    cursor: default !important;

    &.deleted {
      opacity: 0.5;

      .title {
        text-decoration: line-through;
      }
    }

    &:hover {
      .close {
        opacity: 0.5;
      }
    }
  }

  .extra {
    padding-left: 28px;
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
    word-break: break-all;
  }

  .main {
    user-select: none;
    height: 24px;
    display: flex;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 500;
      margin-left: 10px;
      color: rgba(0, 0, 0, 0.8);
      flex: 1;
    }
    .close {
      margin-left: 4px;
      opacity: 0;
      transition: opacity 0.3s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
