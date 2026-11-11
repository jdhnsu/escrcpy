const playingIds = reactive(new Set())

export function useAudioPlayAction() {
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)

  function isPlaying(deviceId) {
    return playingIds.has(deviceId)
  }

  async function start(device, options = {}) {
    const deviceId = device?.id || device

    const args = preferenceStore.scrcpyParameter(deviceId, {
      overrides: {
        '--no-video': true,
        '--no-control': true,
        '--no-window': true,
      },
      excludes: [
        '--no-audio',
        '--video-source',
        '--mouse',
        '--keyboard',
        '--turn-screen-off',
        '--power-off-on-close',
        '--stay-awake',
        '--show-touches',
        '--always-on-top',
        '--fullscreen',
      ],
    })

    try {
      await window.$preload.scrcpy.playAudio(deviceId, {
        args,
        onExit: id => playingIds.delete(id),
        ...options.scrcpyOptions,
      })

      playingIds.add(deviceId)
    }
    catch (error) {
      console.error('audioPlay.args', args)
      console.error('audioPlay.error', error)

      if (error.message) {
        ElMessage.warning(error.message)
      }
    }
  }

  async function stop(device) {
    const deviceId = device?.id || device

    await window.$preload.scrcpy.stopAudio(deviceId)
    playingIds.delete(deviceId)
  }

  async function toggle(input, options = {}) {
    const devices = (Array.isArray(input) ? input : [input]).filter(Boolean)

    loading.value = true

    try {
      for (const device of devices) {
        if (isPlaying(device?.id || device)) {
          await stop(device)
        }
        else {
          await start(device, options)
        }
      }
    }
    finally {
      loading.value = false
    }
  }

  return reactive({
    loading,
    isPlaying,
    toggle,
  })
}

export default useAudioPlayAction
