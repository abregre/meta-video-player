<template>
    <div id="app">
        <video-player />
    </div>
</template>

<script>
    import VideoPlayer from '@/components/VideoPlayer'

    export default {
        name: 'App',
        components: {
            VideoPlayer
        }
    }
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
