<template>
    <div
        ref="videoWrapper"
        class="video-wrapper"
    >
        <figure
            ref="videoContainer"
            class="video-container"
        >
            <video
                ref="videoScreen"
                preload="metadata"
                class="video-screen"
                @click="videoClicked"
                @ended="videoEnded"
                @loadedmetadata="loadedVideoMetaData"
                @timeupdate="updateVideoTime"
            >
                <source
                    :src="require('@/assets/demo-video-2.mp4')"
                    type="video/mp4"
                >
                Sorry your browser can't play this type of video
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
        <transition name="fade">
            <ul
                v-show="showVideoControls"
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
                    <!-- TODO: FIX CLICK EVENT -->
                    <button
                        ref="mute"
                        type="button"
                        class="video-controls__button volume-btn"
                        @click.self="muteClicked"
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
                        <input
                            v-if="!isMobileOrTablet && !isTouchDevice"
                            v-model="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            class="volume-slider"
                            @input="volumeSliderChanged"
                        >
                    </button>
                </li>
                <li v-if="isMobileOrTablet || isTouchDevice">
                    <button
                        ref="volInc"
                        type="button"
                        class="video-controls__button"
                        @click="volIncClicked"
                    >Vol+</button></li>
                <li v-if="isMobileOrTablet || isTouchDevice"><button
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
        </transition>
        <transition name="fade">
            <div
                v-if="showVolumeIndicator"
                class="volume-indicator-wrapper"
                :class="{'show': showVolumeIndicator}"
            >
                <span>Volume</span>
                <div class="volume-indicator-container">
                    <span
                        class="volume-indicator"
                        :style="{'width': volume * 100 + '%'}"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import deviceCheck from '@/utils/device-check'
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
                volume: null,
                volInc: null,
                volDec: null,
                fs: null,
                enableReplay: false,
                isPaused: true,
                isMuted: false,
                isHovering: false,
                showVolumeIndicator: false
            }
        },
        computed: {
            showVideoControls() {
                return this.isPaused || this.isHovering
            },
            isMobileOrTablet() {
                return deviceCheck.isMobileOrTablet()
            },
            isTouchDevice() {
                return deviceCheck.isTouchDevice()
            }
        },
        watch: {
            video: {
                handler(newVal) {
                    if (newVal) {
                        this.video.volume = this.volume
                    }
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
            if (this.supportsVideo) {
                this.initializeVideoScreen()
            }
        },
        methods: {
            initializeVideoScreen() {
                this.videoWrapper = this.$refs.videoWrapper
                this.videoContainer = this.$refs.videoContainer
                this.video = this.$refs.videoScreen
                if (this.video) {
                    this.initializeVideoListeners()
                    this.initializeVideoControls()
                }
            },
            initializeVideoListeners() {
                if (this.isMobileOrTablet || this.isTouchDevice) {
                    return
                }
                this.videoWrapper.addEventListener('mouseover', () => {
                    this.isHovering = true
                })
                this.videoWrapper.addEventListener('mouseout', () => {
                    this.isHovering = false
                })
                this.videoWrapper.addEventListener('dblclick', () => {
                    this.fsClicked()
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
            updateVideoTime() {
                if (!this.progress.getAttribute('max')) {
                    this.progress.setAttribute('max', this.video.duration)
                }
                this.progress.value = this.video.currentTime
                this.progressBar.style.width = Math.floor((this.video.currentTime / this.video.duration) * 100) + '%'
            },
            loadedVideoMetaData() {
                this.progress.max = this.video.duration
            },
            progressClicked(e) {
                const rect = this.progress.getBoundingClientRect()
                const pos = (e.pageX - rect.left) / this.progress.offsetWidth
                this.video.currentTime = pos * this.video.duration
            },
            volumeSliderChanged() {
                this.video.volume = this.volume
                this.flashVolumeIndicator()
            },
            videoClicked() {
                if ((this.isMobileOrTablet || this.isTouchDevice) && this.isPaused) {
                    return
                }
                this.togglePlayPause()
            },
            playPauseClicked() {
                this.togglePlayPause()
            },
            togglePlayPause() {
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
                this.flashVolumeIndicator()
            },
            volDecClicked() {
                this.changeVolume('-')
                this.flashVolumeIndicator()
            },
            flashVolumeIndicator() {
                this.showVolumeIndicator = true
                setTimeout(() => {
                    this.showVolumeIndicator = false
                }, 3000)
            },
            changeVolume(direction) {
                const currentVolume = Math.floor(this.video.volume * 10) / 10
                if (direction === '+') {
                    if (currentVolume < 1) {
                        this.video.volume += 0.1
                    }
                } else if (direction === '-') {
                    if (currentVolume > 0) {
                        this.video.volume -= 0.1
                    }
                }
            },
            fsClicked() {
                if (document.fullscreenElement !== null) {
                    document.exitFullscreen()
                } else {
                    this.videoWrapper.requestFullscreen()
                }
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
    width: 100%;
    height: 33.5rem;
}

.volume-indicator-wrapper {
    position: absolute;
    top: 5%;
    right: 5%;
    height: 3.5rem;
    max-width: 15rem;
    width: 35%;
    color: #fff;
    background: #000;
    padding: 0.5rem;
    display: none;
    flex-direction: column;
    gap: 0.5rem;
}

.volume-indicator-wrapper.show {
    display: flex;
}

.volume-indicator-container {
    background: rgb(19, 19, 19);
    width: 100%;
    height: 100%;
    display: flex;
}

.volume-indicator {
    width: 0;
    height: 1rem;
    background: #fff;
    transition: all 0.5s ease;
}

.video-container {
    width: 100%;
    height: 100%;
    background-color: hsl(0, 0%, 20%);
    position: relative;
}

.video-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    cursor: pointer;
}

.video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    list-style: none;
    padding: 0.5rem 0.15rem;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: #fff;
}

.video-controls .progress {
    cursor: pointer;
    width: 100%;
}

.progress progress {
    width: 100%;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.video-controls__button {
    background-color: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem;
    position: relative;
}

.volume-slider {
    display: none;
}

.video-controls__button.volume-btn:hover .volume-slider{
    display: flex;
    position: absolute;
    top: -5.5rem;
    left: -3.9rem;
    transform: rotate(-90deg);
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
