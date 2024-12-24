<template>
    <header
        class="p-4 border-b bg-green-900 border-green-800 min-h-36 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div class="flex flex-col items-center gap-3 w-full lg:w-auto">
            <img src="/tiro-logo.png" alt="Tiro Logo" class="w-32" />
            <p class="text-green-400">minecraft glyph tool</p>
        </div>

        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
            <div class="flex gap-2 flex-wrap items-center">
                <router-link to="/"
                    class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                    editor
                </router-link>
                <router-link to="/font-builder"
                    class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                    font builder
                </router-link>
                <!-- <router-link to="/style-builder"
                    class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                    style builder
                </router-link> -->
                <router-link to="/generator"
                    class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                    generator
                </router-link>
                <router-link to="/about"
                    class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                    about
                </router-link>
            </div>
        </div>
    </header>
    <router-view></router-view>
    <footer class="bg-green-900 text-center py-12 text-green-400/50 text-sm">
        <p>created with <3 by <a href="https://afarhansib.github.io/" class="hover:text-green-400">
                afarhansib</a></p>
        <p class="mt-2"><a class="hover:text-green-400" href="https://github.com/afarhansib/tiro">contribute
                here</a> • logo created with <a class="hover:text-green-400"
                href="https://web.blockbench.net/?plugins=minecraft_title_generator">blockbench</a></p>
        <p class="mt-2">unlicensed - free to use, modify, sell, claim, whatever</p>
    </footer>
</template>

<script setup>
</script>