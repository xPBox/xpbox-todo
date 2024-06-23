<script lang="ts">
  import {createEventDispatcher} from 'svelte'

  let disabled
  let title = ''
  let desc = ''
  let input: HTMLDivElement
  let editorEl: HTMLDivElement
  export let edit

  let editing = false

  $: disabled = title === ''

  const dispatch = createEventDispatcher()

  $: if (edit) {
    if (editing === false) {
      editing = true
      title = edit.title
      desc = edit.desc
      if (input) {
        input.focus()
      }
    }
  } else {
    editing = false
  }

  const onAdd = (e?: any) => {
    if (disabled) return
    if (edit) {
      dispatch('edit', {title, desc})
    } else {
      dispatch('add', {id: Date.now(), title, desc})
    }
    if (e) {
      console.log(e)
      e.target.blur()
    }
    title = ''
    desc = ''
  }

  const onCancel = () => {
    dispatch('edit', {})
    title = ''
    desc = ''
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      onAdd()
      e.target.blur()
    } else if (e.key === 'Escape') {
      e.target.blur()
    }
  }

  const onBlur = (e) => {
    if (editorEl.contains(e.relatedTarget)) {
      return
    }
    onCancel()
  }

</script>

<div class="editor" bind:this={editorEl}>
  <div class="layer">
    <div class="header">
      <input class="input" type="text" bind:this={input} bind:value={title} maxlength="20" on:keydown={onKeyDown} on:blur={onBlur} />
      <div class="add-btn" tabindex="-1" class:disabled={disabled} on:click={onAdd}>{ edit ? '完成编辑' : '添加' }</div>
    </div>
    <div class="divider"></div>
    <textarea class="extra" placeholder="可以在这里输入描述" bind:value={desc} maxlength="120" on:blur={onBlur} />
  </div>
</div>

<style lang="scss">
  .editor {
    height: 44px;
    z-index: 3;

    .input {
      border: none;
      outline: none;
      height: 100%;
      flex: 1;
      background: transparent;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .header {
      height: 40px;
      display: flex;
      padding: 0 16px 0 10px;
      align-items: center;
    }

    .extra {
      border: none;
      outline: none;
      height: 100%;
      padding: 10px;
      width: 100%;
      background: transparent;
      font-size: 14px;
      color: #333;

      &::placeholder {
        color: #ccc;
      }
    }

    .layer {
      height: 44px;
      border-radius: 16px;
      border: 2px solid rgba(0, 0, 0, 0.05);
      background: rgba(255, 255, 255, 0.8);
      transition: height 0.3s ease, box-shadow 0.3s;
      backdrop-filter: blur(4px);
      overflow: hidden;
    }

    .add-btn {
      color: #0080EE;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #52BAFF;
      }

      &.disabled {
        color: #999;
        cursor: not-allowed;
      }
    }

    .divider {
      height: 1px;
      background: #EEEEEE;
      margin: 0 10px;
    }

    &:focus-within {
      .layer {
        height: 180px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
    }
  }
</style>
