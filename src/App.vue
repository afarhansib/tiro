<template>
    <div class="min-h-screen bg-green-900 text-white lowercase">
        <header class="p-4 border-b border-green-800">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div class="flex flex-col items-center gap-3 w-full lg:w-auto">
                    <img src="/tiro-logo.png" alt="Tiro Logo" class="w-32" />
                    <p class="text-green-400">minecraft glyph editor</p>
                </div>

                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
                    <div class="flex gap-2 flex-wrap items-center">
                        <button @click="mode = 'replace'" :class="[
                            'px-4 py-2 rounded-lg transition-colors',
                            mode === 'replace'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-800 text-green-400'
                        ]">
                            Replace Mode
                        </button>
                        <button @click="mode = 'copy'" :class="[
                            'px-4 py-2 rounded-lg transition-colors',
                            mode === 'copy'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-800 text-green-400'
                        ]">
                            Copy Unicode
                        </button>
                        <button @click="mode = 'delete'" :class="[
                            'px-4 py-2 rounded-lg transition-colors',
                            mode === 'delete'
                                ? 'bg-red-800 text-red-200'
                                : 'bg-green-800 text-green-400'
                        ]">
                            Delete Mode
                        </button>
                        <span class="text-green-400">|</span>
                        <button @click="saveImage"
                            class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                            Save Image
                        </button>
                    </div>
                </div>



                <div class="relative flex flex-col gap-2 w-full lg:w-auto">
                    <label @drop.prevent="handleDrop" @dragover.prevent
                        class="border-2 border-dashed overflow-hidden relative border-green-800 p-8 rounded-lg hover:border-green-600 transition-colors cursor-pointer" :class="{ 'pb-4': filename }">
                        <div v-if="filename"
                            class="absolute pb-1 top-0 left-0 bg-green-800 px-2 py-0.5 text-xs rounded-br-lg
                        before:content-[''] before:absolute before:h-4 before:-bottom-4 before:left-0 before:w-4 before:rounded-tl-lg before:shadow-[0_-6px_0_0_rgb(22,101,52)] before:bg-transparent
                        after:content-[''] after:absolute after:h-2 after:top-0 after:-right-4 after:w-4 after:rounded-tl-lg after:shadow-[-6px_0_0_0_rgb(22,101,52)] after:bg-transparent">
                            <span class="text-green-400">hex prefix: 0x{{ hexPrefix.replace('0x', '') }}</span>
                        </div>
                        <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                        <p class="text-green-400">
                            {{ filename || 'drop or click to upload image' }}
                        </p>
                    </label>
                    <div class="flex items-center gap-2 text-xs">
                        <label class="flex items-center gap-2 text-green-400">
                            <input type="checkbox" v-model="showTooltips"
                                class="rounded border-green-600 text-green-600 focus:ring-green-600 focus:ring-offset-green-900 bg-green-900">
                            Show Tooltips
                        </label>
                    </div>
                </div>
            </div>
        </header>

        <main class="p-4 grid place-items-center">
            <div v-if="imageGrid.length" class="max-w-full overflow-auto p-2">
                <div class="inline-grid grid-cols-[repeat(16,_4rem)] gap-1">
                    <div v-for="(cell, index) in imageGrid" :key="index"
                        class="group relative w-16 h-16 bg-green-700 rounded overflow-hidden hover:ring-2 hover:ring-green-400 transition-all cursor-pointer"
                        @click="handleCellClick(index)" @mousemove="handleMouseMove" @mouseenter="showTooltip = true"
                        @mouseleave="showTooltip = false">
                        <img v-if="cell.hasContent" :src="cell.dataUrl"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform [image-rendering:pixelated]" />
                        <div v-else class="w-full h-full grid place-items-center bg-green-800/50">
                            <span class="text-green-400 text-xs select-none">empty</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="grid place-items-center h-[80vh]">
                <div class="text-center">
                    <h2 class="text-4xl font-bold mb-4">welcome to tiro</h2>
                    <p class="text-green-400">create stunning in-game titles and text art</p>
                </div>
            </div>
            <footer class="text-center mt-12 text-green-400/50 text-sm">
                <p>created with <3 by <a href="https://afarhansib.github.io/"
                        class="hover:text-green-400">afarhansib</a></p>
                <p>crafted in less than 4 hours with the incredible help of <a href="https://about.sourcegraph.com/cody" class="hover:text-green-400">cody</a></p>
                <p class="mt-2"><a class="hover:text-green-400" href="https://github.com/afarhansib/tiro">contribute here</a> • logo created with <a class="hover:text-green-400" href="https://web.blockbench.net/?plugins=minecraft_title_generator">blockbench</a></p>
                <p class="mt-2">unlicensed - free to use, modify, sell, claim, whatever</p>
            </footer>
        </main>
    </div>
    <input id="tilePasteInput" type="file" accept="image/*" class="hidden" @change="handleTilePaste" />

    <!-- Copy Success Notification -->
    <div v-if="showCopyNotice"
        class="fixed bottom-4 right-4 bg-green-800 text-green-400 px-4 py-2 rounded-lg shadow-lg transition-all transform translate-y-0">
        Copied to clipboard!
    </div>

    <div v-show="showTooltips && showTooltip"
        class="fixed pointer-events-none bg-green-800 text-green-400 text-xs px-2 py-1 rounded whitespace-nowrap z-50 transition-opacity duration-[300ms]"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
        :class="{ 'opacity-0': !showTooltip, 'opacity-100': showTooltip }">
        {{ mode === 'replace' ? 'Click to replace' :
            mode === 'delete' ? 'Click to clear' :
                'Click to copy' }}
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 grid place-items-center z-50">
        <div class="bg-green-900 p-6 rounded-lg text-green-400">
            <h3 class="text-lg mb-4">delete this tile?</h3>
            <div class="flex gap-2">
                <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-red-200 rounded">delete</button>
                <button @click="showDeleteModal = false" class="px-4 py-2 bg-green-700 rounded">cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const imageGrid = ref([])
const filename = ref('')
const selectedPosition = ref(null)
const mode = ref('replace')
const hexPrefix = ref('0xE0')
const showCopyNotice = ref(false)
const showDeleteModal = ref(false)
const showTooltips = ref(true)
const tileToDelete = ref(null)

const showTooltip = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)

const handleMouseMove = (event) => {
    tooltipX.value = event.clientX + 10 // Offset from cursor
    tooltipY.value = event.clientY + 10
}

onMounted(() => {
    const savedGrid = localStorage.getItem('tiroGrid')
    const savedFilename = localStorage.getItem('tiroFilename')
    const savedHexPrefix = localStorage.getItem('tiroHexPrefix')
    const savedMode = localStorage.getItem('tiroMode')
    const savedShowTooltips = localStorage.getItem('tiroShowTooltips')

    if (savedGrid) {
        imageGrid.value = JSON.parse(savedGrid)
        filename.value = savedFilename
        hexPrefix.value = savedHexPrefix
        mode.value = savedMode || 'replace'
    }

    if (savedShowTooltips !== null) {
        showTooltips.value = JSON.parse(savedShowTooltips)
    }
})

watch([imageGrid, filename, hexPrefix, mode, showTooltips],
    ([newGrid, newFilename, newHexPrefix, newMode, newShowTooltips]) => {
        localStorage.setItem('tiroGrid', JSON.stringify(newGrid))
        localStorage.setItem('tiroFilename', newFilename)
        localStorage.setItem('tiroHexPrefix', newHexPrefix)
        localStorage.setItem('tiroMode', newMode)
        localStorage.setItem('tiroShowTooltips', JSON.stringify(newShowTooltips))
    }, { deep: true })

const handleCellClick = (index) => {
    if (mode.value === 'delete') {
        tileToDelete.value = index
        showDeleteModal.value = true
    } else if (mode.value === 'replace') {
        selectedPosition.value = index
        document.getElementById('tilePasteInput').click()
    } else {
        const row = Math.floor(index / 16)
        const col = index % 16
        const codePoint = parseInt(hexPrefix.value + '00') + row * 16 + col
        const char = String.fromCodePoint(codePoint)
        navigator.clipboard.writeText(char)
            .then(() => {
                showCopyNotice.value = true
                setTimeout(() => {
                    showCopyNotice.value = false
                }, 2000)
            })
    }
}

const confirmDelete = () => {
    imageGrid.value[tileToDelete.value] = {
        dataUrl: null,
        hasContent: false
    }
    showDeleteModal.value = false
}

const processImage = (file) => {
    filename.value = file.name
    const hexMatch = file.name.match(/[A-F0-9]{2}/i)
    hexPrefix.value = hexMatch ? `0x${hexMatch[0]}` : '0xE0'
    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // Calculate cell dimensions based on image size
            const cellWidth = Math.floor(img.width / 16)
            const cellHeight = Math.floor(img.height / 16)

            // Set canvas to match image dimensions
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const gridCells = []

            // Create exactly 16x16 grid using calculated cell dimensions
            for (let y = 0; y < 16; y++) {
                for (let x = 0; x < 16; x++) {
                    const cellCanvas = document.createElement('canvas')
                    cellCanvas.width = cellWidth
                    cellCanvas.height = cellHeight
                    const cellCtx = cellCanvas.getContext('2d')
                    cellCtx.drawImage(
                        canvas,
                        x * cellWidth,
                        y * cellHeight,
                        cellWidth,
                        cellHeight,
                        0,
                        0,
                        cellWidth,
                        cellHeight
                    )

                    // Check alpha values for empty tile detection
                    const imageData = cellCtx.getImageData(0, 0, cellWidth, cellHeight).data
                    let hasContent = false

                    for (let i = 3; i < imageData.length; i += 4) {
                        if (imageData[i] > 0) {
                            hasContent = true
                            break
                        }
                    }

                    gridCells.push({
                        dataUrl: cellCanvas.toDataURL(),
                        hasContent: hasContent
                    })
                }
            }

            imageGrid.value = gridCells
        }
        img.src = e.target.result
    }
    reader.readAsDataURL(file)
}


const handleDrop = (event) => {
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        processImage(file)
    }
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        processImage(file)
    }
}

const handleTilePaste = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const tileSize = 72 // Fixed tile size from 1152/16

                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = false

                canvas.width = tileSize
                canvas.height = tileSize

                // Left aligned (x=0) and vertically centered
                const x = 0
                const y = (tileSize - img.height) / 2

                // Draw original size without scaling
                ctx.drawImage(img, x, y)

                const imageData = ctx.getImageData(0, 0, tileSize, tileSize).data
                let hasContent = false
                for (let i = 3; i < imageData.length; i += 4) {
                    if (imageData[i] > 0) {
                        hasContent = true
                        break
                    }
                }

                imageGrid.value[selectedPosition.value] = {
                    dataUrl: canvas.toDataURL(),
                    hasContent: hasContent
                }
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const saveImage = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1152  // 72 * 16
    canvas.height = 1152

    imageGrid.value.forEach((cell, index) => {
        if (cell.hasContent) {
            const x = (index % 16) * 72
            const y = Math.floor(index / 16) * 72
            const img = new Image()
            img.src = cell.dataUrl
            ctx.drawImage(img, x, y)
        }
    })

    const link = document.createElement('a')
    link.download = filename.value || 'tiro-export.png'
    link.href = canvas.toDataURL()
    link.click()
}
</script>