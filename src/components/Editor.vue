<template>
    <div class="min-h-screen bg-green-900 text-white lowercase">
        <header
            class="p-4 border-b border-green-800 min-h-36 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <!-- <div class="flex flex-col items-center gap-3 w-full lg:w-auto">
                <img src="/tiro-logo.png" alt="Tiro Logo" class="w-32" />
                <p class="text-green-400">minecraft glyph tool</p>
            </div> -->

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
                    <router-link to="/generator"
                        class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                        Generate Glyph
                    </router-link>
                    <button @click="saveImage"
                        class="px-4 py-2 rounded-lg bg-green-800 text-green-400 hover:bg-green-700 transition-colors">
                        Save Image
                    </button>
                    <label class="text-green-400">item size:
                        <input type="number" v-model="canvasSize" @change="updateCanvasSize" min="16" step="16"
                            class="bg-green-800 border flex-1 border-green-700 rounded-lg px-4 py-2 placeholder-green-700" />
                    </label>
                </div>
            </div>

            <div class="relative flex flex-col gap-2 w-full lg:w-auto">
                <label @drop.prevent="handleDrop" @dragover.prevent
                    class="border-2 border-dashed overflow-hidden relative border-green-800 p-8 rounded-lg hover:border-green-600 transition-colors cursor-pointer"
                    :class="{ 'pb-4': filename }">
                    <div v-if="filename"
                        class="absolute pb-1 top-0 left-0 bg-green-800 px-2 py-0.5 text-xs rounded-br-lg
                        before:content-[''] before:absolute before:h-4 before:-bottom-4 before:left-0 before:w-4 before:rounded-tl-lg before:shadow-[0_-6px_0_0_rgb(22,101,52)] before:bg-transparent
                        after:content-[''] after:absolute after:h-2 after:top-0 after:-right-4 after:w-4 after:rounded-tl-lg after:shadow-[-6px_0_0_0_rgb(22,101,52)] after:bg-transparent">
                        <span class="text-green-400">hex prefix: 0x{{ hexPrefix.replace('0x', '') }}</span>
                    </div>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
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
        </header>

        <main class="p-4 grid place-items-center">
            <div id="panzoom">
                <div v-if="imageGrid.length" class="max-w-full overflow-auto p-2">
                    <div class="inline-grid grid-cols-[repeat(16,_4rem)] gap-1">
                        <div v-for="(cell, index) in imageGrid" :key="index"
                            class="group relative w-16 h-16 bg-green-700 rounded overflow-hidden hover:ring-2 hover:ring-green-400 transition-all cursor-pointer"
                            @click="handleCellClick(index)" @mousemove="handleMouseMove"
                            @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
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
            </div>
            <footer class="text-center mt-12 text-green-400/50 text-sm">
                <p>crafted in less than 4 hours with the incredible help of <a href="https://about.sourcegraph.com/cody"
                        class="hover:text-green-400">cody</a></p>

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
import Panzoom from '@panzoom/panzoom'

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

// When loading from localStorage
onMounted(() => {
    const savedGrid = localStorage.getItem('tiroGrid')
    const savedFilename = localStorage.getItem('tiroFilename')
    const savedHexPrefix = localStorage.getItem('tiroHexPrefix')
    const savedMode = localStorage.getItem('tiroMode')
    const savedShowTooltips = localStorage.getItem('tiroShowTooltips')
    const savedCanvasSize = localStorage.getItem('tiroCanvasSize')

    if (savedGrid) {
        imageGrid.value = JSON.parse(savedGrid)
        filename.value = savedFilename
        hexPrefix.value = savedHexPrefix || '0xE0'
        mode.value = savedMode || 'replace'
        canvasSize.value = parseInt(savedCanvasSize) || 32

        // Create update function for the saved content
        currentUpdateFunction = (newSize) => {
            const promises = imageGrid.value.map((cell) => {
                return new Promise((resolve) => {
                    if (cell.hasContent) {
                        const img = new Image()
                        img.onload = () => {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            canvas.width = newSize
                            canvas.height = newSize
                            ctx.imageSmoothingEnabled = false

                            // Calculate vertical centering offset
                            const verticalOffset = (canvas.height - img.height) / 2

                            // Draw original size without scaling, left aligned and vertically centered
                            ctx.drawImage(
                                img,
                                0,              // Left aligned (x=0)
                                verticalOffset, // Vertically centered
                                img.width,      // Keep original width
                                img.height      // Keep original height
                            )

                            resolve({
                                dataUrl: canvas.toDataURL(),
                                hasContent: cell.hasContent,
                                width: newSize,
                                height: newSize
                            })
                        }
                        img.src = cell.dataUrl
                    } else {
                        resolve({
                            dataUrl: cell.dataUrl,
                            hasContent: false,
                            width: newSize,
                            height: newSize
                        })
                    }
                })
            })

            Promise.all(promises).then(newGrid => {
                imageGrid.value = newGrid
                // Save the updated grid to localStorage
                localStorage.setItem('tiroGrid', JSON.stringify(imageGrid.value))
                localStorage.setItem('tiroCanvasSize', newSize.toString())
            })
        }
    }

    if (savedShowTooltips !== null) {
        showTooltips.value = JSON.parse(savedShowTooltips)
    }

    const element = document.querySelector('#panzoom')
    console.log(element)
    const panzoom = Panzoom(element, {
        canvas: true,
        maxScale: 10,
    })
    const parent = element.parentElement
    parent.addEventListener('wheel', panzoom.zoomWithWheel)
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

const canvasSize = ref(72)
let currentUpdateFunction = null

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        currentUpdateFunction = processImage(file, canvasSize.value)
    }
}

// Update the updateCanvasSize function
const updateCanvasSize = () => {
    if (currentUpdateFunction) {
        currentUpdateFunction(canvasSize.value)
    }
    // Save the new size to localStorage
    localStorage.setItem('tiroCanvasSize', canvasSize.value.toString())
}

const processImage = (file, canvasSize = 32) => {
    filename.value = file.name
    const hexMatch = file.name.match(/[A-F0-9]{2}/i)
    hexPrefix.value = hexMatch ? `0x${hexMatch[0]}` : '0xE0'
    const reader = new FileReader()

    const updateCanvas = (img, size) => {
        const cellWidth = size
        const cellHeight = size

        // Calculate scaling to maintain original image size
        const hRatio = (cellWidth * 16) / img.width
        const vRatio = (cellHeight * 16) / img.height
        const ratio = Math.min(hRatio, vRatio)

        const gridCells = []

        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const cellCanvas = document.createElement('canvas')
                cellCanvas.width = cellWidth
                cellCanvas.height = cellHeight
                const cellCtx = cellCanvas.getContext('2d')
                cellCtx.imageSmoothingEnabled = false

                // Calculate the source dimensions
                const sourceX = (x * img.width) / 16
                const sourceY = (y * img.height) / 16
                const sourceWidth = img.width / 16
                const sourceHeight = img.height / 16

                // Calculate vertical centering offset
                const verticalOffset = (cellHeight - sourceHeight) / 2

                // Draw the portion of the original image
                cellCtx.drawImage(
                    img,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    0,                    // Left aligned (x=0)
                    verticalOffset,       // Vertically centered
                    sourceWidth,          // Keep original width
                    sourceHeight          // Keep original height
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
                    hasContent: hasContent,
                    width: cellWidth,
                    height: cellHeight
                })
            }
        }

        imageGrid.value = gridCells
    }

    reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
            updateCanvas(img, canvasSize)
        }
        img.src = e.target.result
    }
    reader.readAsDataURL(file)

    return (newSize) => {
        if (reader.result) {
            const img = new Image()
            img.onload = () => {
                updateCanvas(img, newSize)
            }
            img.src = reader.result
        }
    }
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
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = false

                // Use the current canvas size instead of fixed size
                canvas.width = canvasSize.value
                canvas.height = canvasSize.value

                // Calculate vertical centering offset
                const verticalOffset = (canvas.height - img.height) / 2

                // Draw original size without scaling, left aligned and vertically centered
                ctx.drawImage(
                    img,
                    0,                  // Left aligned (x=0)
                    verticalOffset,     // Vertically centered
                    img.width,          // Keep original width
                    img.height          // Keep original height
                )

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
                let hasContent = false
                for (let i = 3; i < imageData.length; i += 4) {
                    if (imageData[i] > 0) {
                        hasContent = true
                        break
                    }
                }

                imageGrid.value[selectedPosition.value] = {
                    dataUrl: canvas.toDataURL(),
                    hasContent: hasContent,
                    width: canvas.width,
                    height: canvas.height
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
    canvas.width = canvasSize.value * 16
    canvas.height = canvasSize.value * 16

    imageGrid.value.forEach((cell, index) => {
        if (cell.hasContent) {
            const x = (index % 16) * canvasSize.value
            const y = Math.floor(index / 16) * canvasSize.value
            const img = new Image()
            img.src = cell.dataUrl
            ctx.drawImage(img, x, y)
        }
    })

    // Enhanced filename handling
    let exportName = filename.value || 'untitled'

    // Remove file extension if present
    exportName = exportName.replace(/\.[^/.]+$/, '')

    // Add size and date information
    const date = new Date()
    const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const finalFilename = `${exportName}_${canvasSize.value}x${canvasSize.value}_${timestamp}.png`

    const link = document.createElement('a')
    link.download = finalFilename
    link.href = canvas.toDataURL()
    link.click()
}
</script>