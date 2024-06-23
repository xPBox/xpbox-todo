<script lang="ts">
  import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte'
  import { onMount } from 'svelte'
  import Editor from './Editor.svelte'
  import Item from './Item.svelte'
  import {dndzone} from "svelte-dnd-action";
  import { flip } from 'svelte/animate'
  import { Runtime } from '@xpbox/sdk'

  const runtime = new Runtime()

  runtime.app.ready()

  let items: any[] = []

  let finishedItem: any[] = []

  let editItem = null

  const onAdd = (event: any) => {
    items = [event.detail, ...items]
    runtime.config.update({ items })
  }

  const onEdit = (event: any) => {
    if (!editItem) {
      return
    }
    Object.assign(editItem, event.detail)
    items = [...items]
    editItem = null
    runtime.config.update({ items })
  }

  const startEdit = (item: any) => {
    editItem = item
  }

  const onDel = (event: any) => {
    items = items.filter((item: any) => item.id !== event.detail)
    runtime.config.update({ items })
  }

  const onFinish = (event: any) => {
    const item = items.find((item: any) => item.id === event.detail)
    items = items.filter((item: any) => item.id !== event.detail)
    finishedItem = [item, ...finishedItem]
    runtime.config.update({ items, finishedItem })
  }

  const onUndo = (event: any) => {
    const item = finishedItem.find((item: any) => item.id === event.detail)
    finishedItem = finishedItem.filter((item: any) => item.id !== event.detail)
    items = [item, ...items]
    runtime.config.update({ items, finishedItem })
  }

  const onDelFinished = (event: any) => {
    finishedItem = finishedItem.filter((item: any) => item.id !== event.detail)
    runtime.config.update({ finishedItem })
  }

  onMount(() => {
    runtime.config.onUpdate(async (data) => {
      items = data.data?.items || []
      finishedItem = data.data?.finishedItem || []
    })
    runtime.config.get().then((data) => {
      const ready = data?.isReady
      if (ready) {
        console.log(data)
        items = data.data?.items || []
        finishedItem = data.data?.finishedItem || []
      }
    })

    runtime.invoke('app/setCustomAction', [
      {
        title: '完成所有任务',
        id: 'finish-all'
      },
      {
        title: '清除已完成',
        id: 'clear-finished'
      }
    ])

    runtime.on('action/custom', (data) => {
      if (data.id === 'clear-finished') {
        finishedItem = []
        runtime.config.update({ finishedItem })
      } else if (data.id === 'finish-all') {
        finishedItem = items.concat(finishedItem)
        items = []
        runtime.config.update({ items, finishedItem })
      }
    })

    runtime.export('insertItem', (data) => {
      items = [...items, {
        title: data?.data?.title,
        desc: data?.data?.desc,
        id: Date.now(),
      }]
      return true
    })

    runtime.export('getTodoList', (data) => {
      return items
    })
    runtime.export('getFinishedList', (data) => {
      return finishedItem
    })
    runtime.export('clearFinished', (data) => {
      finishedItem = []
      runtime.config.update({ finishedItem })
      return true
    })
    runtime.export('finishAll', (data) => {
      finishedItem = items.concat(finishedItem)
      items = []
      runtime.config.update({ items, finishedItem })
      return true
    })
    runtime.export('deleteItem', (data) => {
      items = items.filter((item: any) => item.id !== data?.data?.id)
      runtime.config.update({ items })
      return true
    })
    runtime.export('deleteFinishedItem', (data) => {
      finishedItem = finishedItem.filter((item: any) => item.id !== data?.data?.id)
      runtime.config.update({ finishedItem })
      return true
    })
    runtime.export('updateItem', (data) => {
      const item = items.find((item: any) => item.id === data?.data?.id)
      if (!item) {
        return false
      }
      Object.assign(item, data?.data)
      items = [...items]
      runtime.config.update({ items })
      return true
    })
    runtime.export('finishItem', (data) => {
      const item = items.find((item: any) => item.id == data?.data?.id)
      items = items.filter((item: any) => item.id !== data?.data?.id)
      finishedItem = [item, ...finishedItem]
      runtime.config.update({ items, finishedItem })
      return true
    })
  })

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items;
    runtime.config.update({ items })
  }

  let flipDurationMs = 300
</script>

<div class="todo">
  <div class="editor">
    <Editor on:add={onAdd} edit={editItem} on:edit={onEdit}/>
  </div>
  <div class="overlay">
    <OverlayScrollbarsComponent defer>
      <div class="list">
        {#if items?.length > 0 }
          <div class="todo-list" use:dndzone="{{items: items, flipDurationMs}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
            {#each items as item (item.id)}
              <div animate:flip="{{duration: flipDurationMs}}" style="border-radius: 16px">
                <Item item={item} on:delete={onDel} on:check={onFinish} deleted={false} on:click={() => startEdit(item)}/>
              </div>
            {/each}
          </div>
        {/if}
        <div class="finished">
          {#each finishedItem as item (item.id)}
            <Item item={item} on:delete={onDelFinished} on:check={onUndo} deleted={true}/>
          {/each}
        </div>
      </div>
    </OverlayScrollbarsComponent>
  </div>
</div>

<style lang="scss">
  .todo {
    background: rgba(255, 255, 255, 0.92);
    flex: 1;
    padding-top: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(12px);

    .editor {
      padding: 0 12px;
      z-index: 1;
    }

    .list {
      padding: 12px;

      .todo-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
        outline: none !important;
      }

      .finished {
        display: flex;
        gap: 10px;
        flex-direction: column;
      }
    }


    .overlay {
      flex: 1;
      display: flex;
      overflow: hidden;
      width: 100%;
      flex-direction: column;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: block;
        height: 12px;
        //background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
        z-index: 1;
      }
    }
  }
</style>
