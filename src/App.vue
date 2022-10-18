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

.desktop-only {
    display: none;
}

@media screen and (min-width: 768px) {

    .mobile-only {
        display: none;
    }

    .desktop-only {
        display: block;
    }

}
</style>
