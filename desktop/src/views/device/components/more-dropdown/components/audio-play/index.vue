<template>
  <slot
    :loading="audioPlayAction.loading"
    :trigger="handleClick"
    :label="playing ? 'device.actions.more.audioStop.name' : 'device.actions.more.audioPlay.name'"
  />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
  toggleRowExpansion: {
    type: Function,
    default: () => () => false,
  },
})

const audioPlayAction = useAudioPlayAction()

const playing = computed(() => audioPlayAction.isPlaying(props.row?.id))

function handleClick() {
  props.toggleRowExpansion(props.row, true)

  audioPlayAction.toggle(props.row)
}
</script>
