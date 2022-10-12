<template>
    <div class="video-wrapper">
        <figure
            ref="videoContainer"
            class="video-container"
        >
            <video
                ref="videoScreen"
                preload="metadata"
                class="video-screen"
                @ended="videoEnded"
            >
                <source
                    :src="require('@/assets/demo-video.mp4')"
                    type="video/mp4"
                >
            </video>
            <div
                v-if="enableReplay"
                class="replay-btn"
                @click="replayVideo"
            >
                <img
                    :src="require('@/assets/replay.png')"
                    alt="Replay"
                >
            </div>
        </figure>
        <ul
            ref="videoControls"
            class="video-controls"
        >
            <li>
                <button
                    ref="playPause"
                    type="button"
                    class="video-controls__button"
                    @click="playPauseClicked"
                >
                    <img
                        v-if="isPaused"
                        :src="require('@/assets/play.png')"
                        alt="play"
                        class="video-controls__button__icon"
                    >
                    <img
                        v-else
                        :src="require('@/assets/pause.png')"
                        alt="pause"
                        class="video-controls__button__icon"
                    >
                </button>
            </li>
            <li>
                <button
                    ref="stop"
                    type="button"
                    class="video-controls__button"
                    @click="stopClicked"
                >
                    <img
                        :src="require('@/assets/stop.png')"
                        alt="play"
                        class="video-controls__button__icon"
                    >
                </button>
            </li>
            <li class="progress">
                <progress
                    ref="progress"
                    value="0"
                    min="0"
                    @click="progressClicked"
                >
                    <span
                        ref="progressBar"
                    />
                </progress>
            </li>
            <li>
                <button
                    ref="mute"
                    type="button"
                    class="video-controls__button"
                    @click="muteClicked"
                >
                    <img
                        v-if="isMuted"
                        :src="require('@/assets/mute.png')"
                        alt="play"
                        class="video-controls__button__icon"
                    >
                    <img
                        v-else
                        :src="require('@/assets/unmute.png')"
                        alt="pause"
                        class="video-controls__button__icon"
                    >
                </button>
            </li>
            <li>
                <button
                    ref="volInc"
                    type="button"
                    class="video-controls__button"
                    @click="volIncClicked"
                >Vol+</button></li>
            <li><button
                ref="volDec"
                type="button"
                class="video-controls__button"
                @click="volDecClicked"
            >Vol-</button></li>
            <li>
                <button
                    ref="fs"
                    type="button"
                    class="video-controls__button"
                    @click="fsClicked"
                >
                    <img
                        :src="require('@/assets/fullscreen.png')"
                        alt="fullscreen"
                        class="video-controls__button__icon"
                    >
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'VideoPlayer',
        data() {
            return {
                supportsVideo: !!document.createElement('video').canPlayType,
                video: null,
                playPause: null,
                stop: null,
                progress: null,
                progressBar: null,
                mute: null,
                volInc: null,
                volDec: null,
                fs: null,
                enableReplay: false,
                isPaused: true,
                isMuted: false
            }
        },
        mounted() {
            this.initializeVideoScreen()
        },
        methods: {
            initializeVideoScreen() {
                this.videoContainer = this.$refs.videoContainer
                this.video = this.$refs.videoScreen
                if (this.video) {
                    this.initializeVideoListeners()
                    this.initializeVideoControls()
                }
            },
            initializeVideoListeners() {
                this.video.addEventListener('loadedmetadata', () => {
                    this.progress.max = this.video.duration
                })
                this.video.addEventListener('timeupdate', () => {
                    if (!this.progress.getAttribute('max')) {
                        this.progress.setAttribute('max', this.video.duration)
                    }
                    this.progress.value = this.video.currentTime
                    this.progressBar.style.width = Math.floor((this.video.currentTime / this.video.duration) * 100) + '%'
                })
                document.addEventListener('fullscreenchange', (e) => {
                    this.setFullscreenData(!!(document.fullScreen || document.fullscreenElement))
                })
            },
            initializeVideoControls() {
                this.videoControls = this.$refs.videoControls
                this.playPause = this.$refs.playPause
                this.stop = this.$refs.stop
                this.progress = this.$refs.progress
                this.progressBar = this.$refs.progressBar
                this.mute = this.$refs.mute
                this.volInc = this.$refs.volInc
                this.volDec = this.$refs.volDec
                this.fs = this.$refs.fs
            },
            progressClicked(e) {
                const rect = this.progress.getBoundingClientRect()
                const pos = (e.pageX - rect.left) / this.progress.offsetWidth
                this.video.currentTime = pos * this.video.duration
            },
            playPauseClicked() {
                if (this.video.paused || this.video.ended) {
                    if (this.video.ended) {
                        this.video.currentTime = 0
                    }
                    this.video.play()
                    this.isPaused = false
                } else {
                    this.video.pause()
                    this.isPaused = true
                }
            },
            replayVideo() {
                this.video.currentTime = 0
                this.video.play()
                this.enableReplay = false
                this.isPaused = false
            },
            stopClicked() {
                this.video.pause()
                this.isPaused = true
                this.video.currentTime = 0
                this.progress.value = 0
            },
            muteClicked() {
                this.video.muted = !this.video.muted
                this.isMuted = !this.isMuted
            },
            volIncClicked() {
                this.changeVolume('+')
            },
            volDecClicked() {
                this.changeVolume('-')
            },
            changeVolume(direction) {
                const currentVolume = Math.floor(this.video.volume * 10) / 10
                if (direction === '+') {
                    if (currentVolume < 1) {
                        this.video.volume += 0.05
                    }
                } else if (direction === '-') {
                    if (currentVolume > 0) {
                        this.video.volume -= 0.05
                    }
                }
            },
            fsClicked() {
                if (document.fullscreenElement !== null) {
                    document.exitFullscreen()
                    this.setFullscreenData(false)
                } else {
                    this.videoContainer.requestFullscreen()
                    this.setFullscreenData(true)
                }
            },
            setFullscreenData(state) {
                this.videoContainer.setAttribute('data-fullscreen', !!state)
            },
            videoEnded() {
                this.enableReplay = true
                this.isPaused = true
            }

        }
    }
</script>

<style scoped>
.video-wrapper {
    position: relative;
    margin: 0 auto;
}

.video-container {
    max-width: 64rem;
    width: 100%;
    height: 30.875rem;
    background-color: hsl(0, 0%, 20%);
    overflow: hidden;
    padding-top: 591.44px / 1127.34px * 100%;
}

.video-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
}

.video-controls {
    max-width: 64rem;
    width: 100%;
    height: 2.5rem;
    position: relative;
    list-style: none;
    padding: 0.5rem 0.15rem;
    margin: 0 auto;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: #fff;
}

.video-controls[data-state="hidden"] {
    display: none;
}

.video-controls[data-state="visible"] {
    display: block;
}

.video-controls .progress {
    cursor: pointer;
    width: 100%;
}

.progress progress {
    width: 100%;
}

.video-controls__button {
    background-color: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem;
}

.replay-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100px;
    cursor: pointer;
}

.replay-btn img {
    width: 100%;
    height: auto;
}

.video-controls__button__icon {
    width: 1.2rem;
    height: 1.2rem;
}
</style>
