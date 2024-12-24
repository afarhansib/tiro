<!-- FontBuilder.vue -->
<template>
    <div class="min-h-screen bg-green-900 text-white" @paste="handlePaste" tabindex="0">
        <div class="container mx-auto p-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Character Grid -->
                <div class="bg-green-800 rounded-lg p-4">
                    <h2 class="text-green-400 mb-4">character map</h2>

                    <!-- Character Grid -->
                    <div class="grid gap-2" :style="{
                        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
                    }">
                        <div v-for="char in chars" :key="char"
                            class="aspect-square bg-green-700 rounded-lg p-2 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
                            @click="selectCharSlot(char)">
                            <span :class="[
                                'text-2xl',
                                characterMap[char] ? 'text-white' : 'text-green-500'
                            ]">
                                {{ char }}
                            </span>
                        </div>
                    </div>

                    <button @click="exportCharacterMap"
                        class="mt-6 px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                        export
                    </button>
                </div>

                <!-- Source Panel -->
                <div class="bg-green-800 rounded-lg p-4">
                    <h2 class="text-green-400 mb-4">source image</h2>

                    <!-- Upload Area -->
                    <div class="border-2 border-dashed border-green-700 rounded-lg p-8 text-center" @dragover.prevent
                        @drop.prevent="handleDrop">
                        <!-- Show upload options when no image -->
                        <div v-if="!sourceImage">
                            <p class="text-green-400 mb-2">drag image here</p>
                            <p class="text-green-600">or</p>
                            <p class="text-green-400 mb-2">paste from clipboard (ctrl+v)</p>
                            <p class="text-green-600">or</p>
                            <input type="file" accept="image/*" @change="handleFileSelect" class="hidden"
                                ref="fileInput">
                            <button @click="$refs.fileInput.click()"
                                class="mt-2 px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                                select file
                            </button>
                        </div>

                        <!-- Image Preview with Selection -->
                        <div v-if="sourceImage" class="relative">
                            <img :src="processedImage" ref="imagePreview"
                                class="max-w-full [image-rendering:pixelated] prevent-drag"
                                @mousedown.prevent="startSelection" :style="{
                                    transform: `scale(${zoom})`
                                }">
                            <!-- Character bounds overlay -->
                            <div v-for="(char, i) in detectedCharacters" :key="i"
                                class="absolute border border-green-400 pointer-events-none" :style="{
                                    left: `${char.minX * zoom}px`,
                                    top: `${char.minY * zoom}px`,
                                    width: `${char.width * zoom}px`,
                                    height: `${char.height * zoom}px`
                                }"></div>
                            <!-- Grid Overlay -->
                            <div v-if="showGrid" class="absolute top-0 left-0 w-full h-full pointer-events-none" :style="{
                                backgroundImage: `
          linear-gradient(to right, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
        `,
                                backgroundSize: `${zoom}px ${zoom}px`,
                                transform: 'translate(0.5px, 0.5px)'
                            }"></div>
                            <!-- Selection Overlay -->
                            <div v-if="selection.active" class="absolute border-2 border-green-400 pointer-events-none"
                                :style="{
                                    left: `${selection.startX}px`,
                                    top: `${selection.startY}px`,
                                    width: `${selection.width}px`,
                                    height: `${selection.height}px`,
                                    transform: `scale(${zoom})`
                                }"></div>
                        </div>
                    </div>

                    <!-- Image Controls -->
                    <div v-if="sourceImage" class="mt-4 space-y-2">
                        <div class="flex gap-2">
                            <div class="flex items-center gap-2 mb-2">
                                <label class="text-green-400">Detection threshold:</label>
                                <input type="range" v-model.number="threshold" min="0" max="255" step="1" class="w-32">
                                <span class="text-green-400">{{ threshold }}</span>
                            </div>

                            <button @click="detectCharacters"
                                class="px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                                detect characters
                            </button>

                            <!-- Show detected characters count -->
                            <span v-if="detectedCharacters.length" class="text-green-400">
                                found {{ detectedCharacters.length }} characters
                            </span>
                        </div>
                        <!-- Size Controls -->
                        <div class="flex flex-col gap-2">
                            <!-- <div class="flex items-center gap-2">
                                <label class="text-green-400">original size:</label>
                                <span class="text-green-400">{{ originalSize.width }}x{{ originalSize.height }}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <label class="text-green-400">resize:</label>
                                <input type="number" v-model.number="resizeScale" min="0.1" max="10" step="0.1"
                                    class="w-24 bg-green-700 rounded px-2 py-1">
                                <span class="text-green-400">x</span>
                                <button @click="resizeImage"
                                    class="px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                                    apply
                                </button>
                            </div> -->

                            <!-- Current size display -->
                            <!-- <div class="flex items-center gap-2">
                                <label class="text-green-400">current size:</label>
                                <span class="text-green-400">
                                    {{ Math.round(originalSize.width * resizeScale) }}x{{ Math.round(originalSize.height
                                        * resizeScale) }}
                                </span>
                            </div> -->

                            <!-- Zoom Controls -->
                            <!-- <div class="flex items-center gap-2">
                                <label class="text-green-400">view zoom:</label>
                                <input type="range" v-model.number="zoom" min="1" max="8" step="1" class="w-full">
                                <span class="text-green-400">{{ zoom }}x</span>
                            </div> -->
                        </div>

                        <!-- Other Controls -->
                        <div class="flex gap-2">
                            <!-- <button @click="toggleGrid"
                                class="px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                                toggle grid
                            </button> -->
                            <button @click="clearImage"
                                class="px-4 py-2 bg-green-700 rounded-lg hover:bg-green-600 transition-colors">
                                clear
                            </button>
                        </div>
                    </div>

                    <!-- Preview of Current Selection -->
                    <div v-if="selection.active" class="mt-4">
                        <h3 class="text-green-400 mb-2">current selection</h3>
                        <div class="flex gap-4 items-center">
                            <div class="bg-green-700 p-2 rounded-lg">
                                <canvas ref="previewCanvas" :width="selection.width" :height="selection.height"
                                    class="w-32 h-32 [image-rendering:pixelated] object-contain"></canvas>
                            </div>
                            <div class="text-green-400">
                                <p>size: {{ selection.width }}x{{ selection.height }}</p>
                                <p>position: {{ selection.startX }}, {{ selection.startY }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add preview section after detection -->
                <div v-if="detectedCharacters.length && imagePreview?.complete" class="mt-4">
                    <h3 class="text-lg mb-2">Detected Characters</h3>

                    <div class="flex">
                        <!-- Character previews grid -->
                        <div class="flex flex-wrap gap-2">
                            <div v-for="(char, i) in detectedCharacters" :key="i"
                                class="relative bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
                                @click="previewCharacter(char)">
                                <!-- Original crop preview -->
                                <img :src="getCharacterPreview(char)"
                                    class="w-full h-auto [image-rendering:pixelated]" />

                                <div v-if="selectedCharacter === char"
                                    class="absolute inset-0 border-2 border-green-500">
                                </div>
                            </div>
                        </div>

                        <!-- Preview panel -->
                        <div v-if="selectedCharacter && selectedPixelPreview" class="mt-4 p-4 bg-gray-800 rounded">
                            <!-- Size Information -->
                            <div class="mb-4 text-green-400">
                                <p>Original Size: {{ sizeInfo.originalSize }} pixels</p>
                                <div class="flex items-center gap-2">
                                    <p>Scale Factor: </p>
                                    <input type="number" v-model.number="sizeInfo.scaleFactor" step="0.1" min="0.1"
                                        class="w-20 bg-gray-700 px-2 py-1 rounded" @change="updatePixelPreview" />
                                    <button class="px-2 py-1 bg-green-700 rounded hover:bg-green-600"
                                        @click="applyScaleToAll">
                                        Apply to all
                                    </button>
                                </div>
                                <div class="flex gap-2 mb-2">
                                    <button v-for="preset in [4, 6, 8, 10, 12]" :key="preset"
                                        class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                                        @click="sizeInfo.scaleFactor = preset; updatePixelPreview()">
                                        {{ preset }}x
                                    </button>
                                </div>
                                <p>Detected Size: {{ sizeInfo.pixelSize }} pixels</p>
                                <p>Confidence: {{ sizeInfo.confidence }}%</p>
                            </div>

                            <div class="flex gap-8">
                                <div>
                                    <h5 class="mb-2">Original</h5>
                                    <img :src="getCharacterPreview(selectedCharacter)"
                                        class="border border-gray-600 [image-rendering:pixelated]" />
                                </div>
                                <div>
                                    <h5 class="mb-2">Pixel Preview</h5>
                                    <img :src="selectedPixelPreview"
                                        class="border border-gray-600 [image-rendering:pixelated]" />
                                </div>
                            </div>

                            <!-- Character assignment -->
                            <div class="mt-4">
                                <h5 class="mb-2">Assign to:</h5>
                                <div class="flex flex-wrap gap-1">
                                    <div v-for="char in chars" :key="char" :data-char="char"
                                        class="w-8 h-8 bg-gray-700 hover:bg-gray-600 cursor-pointer flex items-center justify-center"
                                        @click="assignCharacter(char)">
                                        {{ char }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Remove outline when div is focused */
div:focus {
    outline: none;
}

/* Add some visual grouping for different character sets */
.char-group-divider {
    grid-column: 1 / -1;
    height: 2px;
    background-color: theme('colors.green.600');
    margin: 0.5rem 0;
}

img {
    user-select: none;
    -webkit-user-select: none;
    transition: transform 0.1s ease-out;
}

/* Prevent text selection while dragging */
.selection-area {
    user-select: none;
    -webkit-user-select: none;
}

/* Prevent image dragging and selection */
.prevent-drag {
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue'

// State
const sourceImage = ref(null)
const zoom = ref(1)
const charSize = ref(16)
const gridCols = ref(10)

// Define character sets
const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const lowerChars = 'abcdefghijklmnopqrstuvwxyz'.split('')
const numberChars = '0123456789'.split('')
const chars = [...upperChars, ...lowerChars, ...numberChars]

const characterMap = reactive({})
const fileInput = ref(null)
const imagePreview = ref(null)
const showGrid = ref(false)
const previewCanvas = ref(null)

const characterScales = reactive(new Map()); // Store individual character scales

// Add to state
const sizeInfo = ref(null);

const threshold = ref(2);

// Add to existing state
const selectedCharacter = ref(null);
const selectedPixelPreview = ref(null);

// Add to existing state
const detectedCharacters = ref([])

const originalSize = reactive({
    width: 0,
    height: 0
})
const resizeScale = ref(1)
const processedImage = ref(null)

// Selection state
const selection = reactive({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    width: 0,
    height: 0,
    imageData: null,
    isDragging: false
})

onMounted(() => {
    document.querySelector('.min-h-screen')?.focus()
})

// Initialize image and canvas contexts
const initializeImage = () => {
    const img = imagePreview.value
    if (!img) return

    // Make image draggable for selection
    img.addEventListener('mousedown', startSelection)
    img.addEventListener('mousemove', updateSelection)
    img.addEventListener('mouseup', endSelection)
}

// Modified getCharacterPreview function
const getCharacterPreview = (bounds) => {
    // Check if we have a valid image to work with
    if (!imagePreview.value || !bounds) return '';

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = bounds.width;
        canvas.height = bounds.height;

        // Make sure we have a valid image element
        if (imagePreview.value instanceof HTMLImageElement && imagePreview.value.complete) {
            ctx.drawImage(
                imagePreview.value,
                bounds.minX,
                bounds.minY,
                bounds.width,
                bounds.height,
                0,
                0,
                bounds.width,
                bounds.height
            );
            return canvas.toDataURL();
        }
        return '';
    } catch (error) {
        console.error('Error creating character preview:', error);
        return '';
    }
};

// Modified previewCharacter function
const previewCharacter = (char) => {
    try {
        selectedCharacter.value = char;

        // Get existing scale or calculate new one
        let dimensions;
        if (characterScales.has(char)) {
            dimensions = characterScales.get(char);
        } else {
            dimensions = calculatePixelDimensions([char])[0];
            // console.log(calculatePixelDimensions([char]))
            if (dimensions) {
                characterScales.set(char, dimensions);
            }
        }

        if (!dimensions) {
            console.log('Could not determine character dimensions');
            return;
        }

        // Update size information
        sizeInfo.value = {
            originalSize: `${Math.round(char.width)}x${Math.round(char.height)}`,
            pixelSize: `${dimensions.originalWidth}x${dimensions.originalHeight}`,
            scaleFactor: dimensions.factor,
            confidence: Math.round(dimensions.confidence * 100)
        };

        updatePixelPreview();
    } catch (error) {
        console.error('Error previewing character:', error);
    }
};

// Add update function for when scale changes
const updatePixelPreview = () => {
    if (!selectedCharacter.value || !sizeInfo.value) return;

    const char = selectedCharacter.value;
    const currentDimensions = characterScales.get(char);

    if (!currentDimensions) return;

    // Update dimensions with new scale factor
    const updatedDimensions = {
        ...currentDimensions,
        factor: sizeInfo.value.scaleFactor,
        originalWidth: Math.round(char.width / sizeInfo.value.scaleFactor),
        originalHeight: Math.round(char.height / sizeInfo.value.scaleFactor)
    };

    // Update stored dimensions
    characterScales.set(char, updatedDimensions);

    // Update pixel preview
    const pixels = sampleCharacter(char, updatedDimensions);
    if (pixels) {
        selectedPixelPreview.value = previewPixelData(pixels);
    }

    // Update size info display
    sizeInfo.value = {
        ...sizeInfo.value,
        pixelSize: `${updatedDimensions.originalWidth}x${updatedDimensions.originalHeight}`
    };
};

// Add function to apply current scale to all characters
const applyScaleToAll = () => {
    if (!selectedCharacter.value || !sizeInfo.value) return;

    const currentScale = sizeInfo.value.scaleFactor;

    detectedCharacters.value.forEach(char => {
        const dimensions = {
            factor: currentScale,
            originalWidth: Math.round(char.width / currentScale),
            originalHeight: Math.round(char.height / currentScale),
            confidence: 1
        };
        characterScales.set(char, dimensions);
    });

    // Refresh current preview
    updatePixelPreview();
};

// Assign character to the map
const assignCharacter = (char) => {
    if (!selectedCharacter.value) return;

    // Create a temporary canvas for the character image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = selectedCharacter.value.width;
    tempCanvas.height = selectedCharacter.value.height;

    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(
        imagePreview.value,
        selectedCharacter.value.minX,
        selectedCharacter.value.minY,
        selectedCharacter.value.width,
        selectedCharacter.value.height,
        0,
        0,
        selectedCharacter.value.width,
        selectedCharacter.value.height
    );

    // Store in character map (using existing structure)
    characterMap[char] = {
        imageData: ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height),
        dataUrl: tempCanvas.toDataURL(),
        x: selectedCharacter.value.minX,
        y: selectedCharacter.value.minY,
        width: selectedCharacter.value.width,
        height: selectedCharacter.value.height
    };

    // Update the character grid display (using existing code)
    const charElement = document.querySelector(`[data-char="${char}"]`);
    if (charElement) {
        const preview = document.createElement('img');
        preview.src = characterMap[char].dataUrl;
        preview.className = 'w-full h-full object-contain';

        charElement.innerHTML = '';
        charElement.appendChild(preview);
    }

    // Clear selection
    selectedCharacter.value = null;
    selectedPixelPreview.value = null;
};

const exportCharacterMap = () => {
    // Convert imageData to base64 string if needed
    const exportableMap = Object.entries(characterMap).reduce((acc, [char, data]) => {
        acc[char] = {
            dataUrl: data.dataUrl,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height
        };
        return acc;
    }, {});

    // Create and download JSON file
    const jsonString = JSON.stringify(exportableMap, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'character-map.json';
    link.click();

    URL.revokeObjectURL(url);
};

// Modified detectCharacters function with more error handling
const detectCharacters = () => {
    if (!imagePreview.value) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Use original image dimensions
    canvas.width = originalSize.width;
    canvas.height = originalSize.height;

    try {
        // Draw current image
        ctx.drawImage(imagePreview.value, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert to binary (assuming light characters on dark background)
        const binaryData = new Uint8Array(canvas.width * canvas.height);
        const thresholdValue = threshold.value;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const brightness = (r + g + b) / 3;
            binaryData[i / 4] = brightness > thresholdValue ? 1 : 0;
        }

        // Find connected components
        const components = [];
        const visited = new Set();

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const pos = y * canvas.width + x;
                if (binaryData[pos] === 1 && !visited.has(pos)) {
                    const bounds = floodFill(x, y, binaryData, visited, canvas.width, canvas.height);
                    if (bounds) {  // Check if bounds were found
                        components.push(bounds);
                    }
                }
            }
        }

        // Only proceed if we found components
        if (components.length === 0) {
            console.log('No characters detected. Try adjusting the threshold.');
            detectedCharacters.value = [];
            return;
        }

        // Group similar sized components
        const groups = groupSimilarSized(components);
        const mainGroup = findMainGroup(groups);

        // Update state with detected characters
        // detectedCharacters.value = mainGroup;
        detectedCharacters.value = components;

        // Calculate average character size
        if (mainGroup.length > 0) {
            const avgWidth = Math.round(average(mainGroup.map(c => c.width)));
            const avgHeight = Math.round(average(mainGroup.map(c => c.height)));
            console.log(`Average character size: ${avgWidth}x${avgHeight} pixels`);
        }
    } catch (error) {
        console.error('Error detecting characters:', error);
        detectedCharacters.value = [];
    }
};

// Flood fill to find character bounds
const floodFill = (startX, startY, binaryData, visited, width, height) => {
    const queue = [[startX, startY]];
    const bounds = {
        minX: startX,
        maxX: startX,
        minY: startY,
        maxY: startY
    };

    while (queue.length > 0) {
        const [x, y] = queue.shift();
        const pos = y * width + x;

        if (visited.has(pos)) continue;
        visited.add(pos);

        // Update bounds
        bounds.minX = Math.min(bounds.minX, x);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxY = Math.max(bounds.maxY, y);

        // Check neighbors
        const neighbors = [
            [x + 1, y], [x - 1, y],
            [x, y + 1], [x, y - 1]
        ];

        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width &&
                ny >= 0 && ny < height &&
                binaryData[ny * width + nx] === 1 &&
                !visited.has(ny * width + nx)) {
                queue.push([nx, ny]);
            }
        }
    }

    bounds.width = bounds.maxX - bounds.minX + 1;
    bounds.height = bounds.maxY - bounds.minY + 1;
    return bounds;
};

// Modified groupSimilarSized with safety check
const groupSimilarSized = (components) => {
    if (!components || components.length === 0) return [];

    const groups = [];
    const tolerance = 0.2; // 20% size difference tolerance

    for (const comp of components) {
        let found = false;
        for (const group of groups) {
            const reference = group[0];
            const widthDiff = Math.abs(comp.width - reference.width) / reference.width;
            const heightDiff = Math.abs(comp.height - reference.height) / reference.height;

            if (widthDiff < tolerance && heightDiff < tolerance) {
                group.push(comp);
                found = true;
                break;
            }
        }
        if (!found) {
            groups.push([comp]);
        }
    }

    return groups;
};

const average = arr => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
};

// Modified findMainGroup function with safety checks
const findMainGroup = (groups) => {
    if (!groups || groups.length === 0) return [];
    return groups.reduce((a, b) => a.length > b.length ? a : b, groups[0]);
};

// Selection handlers
const startSelection = (e) => {
    e.preventDefault()

    const rect = e.target.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / zoom.value)
    const y = Math.floor((e.clientY - rect.top) / zoom.value)

    selection.isDragging = true
    selection.active = true
    selection.startX = x
    selection.startY = y
    selection.currentX = x
    selection.currentY = y
    selection.width = 0
    selection.height = 0

    // Add global mouse event listeners
    window.addEventListener('mousemove', updateSelection)
    window.addEventListener('mouseup', endSelection)
}

const updateSelection = (e) => {
    if (!selection.isDragging) return
    e.preventDefault()

    const rect = imagePreview.value.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / zoom.value)
    const y = Math.floor((e.clientY - rect.top) / zoom.value)

    selection.currentX = x
    selection.currentY = y

    // Calculate width and height
    selection.width = Math.abs(selection.currentX - selection.startX)
    selection.height = Math.abs(selection.currentY - selection.startY)

    // Adjust start position if dragging left/up
    selection.startX = Math.min(selection.currentX, selection.startX)
    selection.startY = Math.min(selection.currentY, selection.startY)

    updatePreview()
}

const endSelection = () => {
    selection.isDragging = false
    window.removeEventListener('mousemove', updateSelection)
    window.removeEventListener('mouseup', endSelection)
    updatePreview()
}

// Update preview canvas with current selection
const updatePreview = () => {
    const canvas = previewCanvas.value
    if (!canvas || !imagePreview.value) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(
        imagePreview.value,
        selection.startX,
        selection.startY,
        selection.width,
        selection.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    // Store the image data for later use
    selection.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// Handle clipboard paste
const handlePaste = (event) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile()
            if (file) loadImage(file)
            break
        }
    }
}

// Methods
const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) loadImage(file)
}

const handleDrop = (event) => {
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) loadImage(file)
}

// Load and process image
const loadImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
            originalSize.width = img.width
            originalSize.height = img.height
            sourceImage.value = e.target.result

            // Auto-calculate initial scale if image is very large
            if (img.width > 256 || img.height > 256) {
                processedImage.value = sourceImage.value
                return
                const scaleX = 256 / img.width
                const scaleY = 256 / img.height
                resizeScale.value = Math.min(scaleX, scaleY)
                resizeImage()
            } else {
                processedImage.value = sourceImage.value
                resizeScale.value = 1
            }
        }
        img.src = e.target.result
    }
    reader.readAsDataURL(file)
}

// Resize image
const resizeImage = () => {
    const img = new Image()
    img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Calculate new dimensions
        const newWidth = Math.round(img.width * resizeScale.value)
        const newHeight = Math.round(img.height * resizeScale.value)

        // Set canvas size to the scaled dimensions
        canvas.width = newWidth
        canvas.height = newHeight

        // Disable image smoothing for pixel-perfect scaling
        ctx.imageSmoothingEnabled = false
        ctx.webkitImageSmoothingEnabled = false
        ctx.mozImageSmoothingEnabled = false
        ctx.msImageSmoothingEnabled = false

        // Draw scaled image
        ctx.drawImage(
            img,
            0, 0,
            img.width, img.height,
            0, 0,
            newWidth, newHeight
        )

        // Update processed image
        processedImage.value = canvas.toDataURL()

        // Reset selection if active
        if (selection.active) {
            selection.active = false
            selection.width = 0
            selection.height = 0
        }
    }
    img.src = sourceImage.value
}

const validateResizeScale = (value) => {
    if (value < 0.1) return 0.1
    if (value > 10) return 10
    return value
}

const toggleGrid = () => {
    // Toggle grid overlay
    // Will implement later
}

// Modified clearImage function
const clearImage = () => {
    sourceImage.value = null;
    if (imagePreview.value) {
        imagePreview.value.src = '';
    }
    detectedCharacters.value = [];
    selectedCharacter.value = null;
    selectedPixelPreview.value = null;
    sizeInfo.value = null;
};

// Modified calculatePixelDimensions function
const calculatePixelDimensions = (characters) => {
    // console.log(characters)
    try {
        const avgWidth = average(characters.map(c => c.width));
        const avgHeight = average(characters.map(c => c.height));

        const possibleScalingFactors = [];
        // Expand the range to handle more diverse sizes
        const minSize = 5;
        const maxSize = 32; // Increased to handle larger characters

        for (let i = minSize; i <= maxSize; i++) {
            const widthFactor = avgWidth / i;

            // Allow for more diverse height ratios
            // Calculate reasonable height range based on width
            const minHeight = Math.max(minSize, Math.floor(i * 0.5));  // Allow shorter characters
            const maxHeight = Math.ceil(i * 3);  // Allow taller characters

            for (let j = minHeight; j <= maxHeight; j++) {
                const heightFactor = avgHeight / j;

                // Calculate aspect ratio confidence
                const aspectRatioConfidence = 1 / (1 + Math.abs(widthFactor - heightFactor) / Math.min(widthFactor, heightFactor));

                // Size reasonability check
                const sizeConfidence = 1 - (Math.abs(i - j) / maxSize);

                // Overall confidence combining both factors
                const confidence = (aspectRatioConfidence + sizeConfidence) / 2;

                possibleScalingFactors.push({
                    factor: (widthFactor + heightFactor) / 2,
                    originalWidth: i,
                    originalHeight: j,
                    confidence: confidence
                });
            }
        }

        // Sort by confidence but always return results
        possibleScalingFactors.sort((a, b) => b.confidence - a.confidence);

        // Return at least the top results even if confidence is low
        return possibleScalingFactors.slice(0, 5);
    } catch (error) {
        console.error('Error calculating dimensions:', error);
        return [];
    }
};

// Modified sampleCharacter to use stored dimensions
const sampleCharacter = (char, dimensions) => {
    if (!imagePreview.value || !char || !dimensions) return null;

    try {
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });

        cropCanvas.width = char.width;
        cropCanvas.height = char.height;

        cropCtx.drawImage(
            imagePreview.value,
            char.minX,
            char.minY,
            char.width,
            char.height,
            0,
            0,
            char.width,
            char.height
        );

        const { originalWidth, originalHeight, factor } = dimensions;

        const pixels = Array(originalHeight).fill().map(() =>
            Array(originalWidth).fill(0)
        );

        // Sample each original pixel position
        for (let y = 0; y < originalHeight; y++) {
            for (let x = 0; x < originalWidth; x++) {
                const centerX = Math.floor((x + 0.5) * factor);
                const centerY = Math.floor((y + 0.5) * factor);

                const imageData = cropCtx.getImageData(centerX, centerY, 1, 1).data;
                const brightness = (imageData[0] + imageData[1] + imageData[2]) / 3;

                pixels[y][x] = brightness > threshold.value ? 1 : 0;
            }
        }

        return pixels;
    } catch (error) {
        console.error('Error sampling character:', error);
        return null;
    }
};

// Modified previewPixelData function
const previewPixelData = (pixels) => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = 20; // Preview scale
        canvas.width = pixels[0].length * scale;
        canvas.height = pixels.length * scale;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[0].length; x++) {
                if (pixels[y][x]) {
                    ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1);
                }
            }
        }

        return canvas.toDataURL();
    } catch (error) {
        console.error('Error creating pixel preview:', error);
        return null;
    }
};

// Update character map when a slot is selected
const selectCharSlot = (char) => {
    if (!selection.imageData) return

    // Create a temporary canvas to store the character image
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = selection.width
    tempCanvas.height = selection.height

    const ctx = tempCanvas.getContext('2d')
    ctx.putImageData(selection.imageData, 0, 0)

    characterMap[char] = {
        imageData: selection.imageData,
        dataUrl: tempCanvas.toDataURL(),
        x: selection.startX,
        y: selection.startY,
        width: selection.width,
        height: selection.height
    }

    // Update the character grid display
    const charElement = document.querySelector(`[data-char="${char}"]`)
    if (charElement) {
        const preview = document.createElement('img')
        preview.src = characterMap[char].dataUrl
        preview.className = 'w-full h-full object-contain'

        // Clear existing content and add preview
        charElement.innerHTML = ''
        charElement.appendChild(preview)
    }
}

// Watch for character size changes
watch(charSize, () => {
    if (selection.active) {
        updatePreview()
    }
})

watch(resizeScale, (newValue) => {
    resizeScale.value = validateResizeScale(newValue)
})

// Helper to get character position in spritesheet
const getCharacterPosition = (char) => {
    const index = chars.indexOf(char)
    if (index === -1) return null

    return {
        row: Math.floor(index / gridCols.value),
        col: index % gridCols.value
    }
}

// Helper to get character from position
const getCharacterFromPosition = (row, col) => {
    const index = (row * gridCols.value) + col
    return chars[index] || null
}

// Calculate total rows needed
const totalRows = computed(() => Math.ceil(chars.length / gridCols.value))

// Add cleanup on component unmount
onUnmounted(() => {
    clearImage();
});
</script>