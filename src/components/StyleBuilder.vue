<template>
    <div class="min-h-screen bg-green-900 text-white lowercase p-4">
        <div class="max-w-2xl mx-auto space-y-6">
            <h1 class="text-2xl font-bold text-green-400">style builder</h1>
            <div class="space-y-2">
                <label class="text-green-400">Enter your text</label>
                <input v-model="userText" type="text"
                    class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Enter your text here">
            </div>
            <div class="space-y-2">
                <label class="text-green-400">Choose a font</label>
                <select v-model="selectedFont"
                    class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
                    <option v-for="font in fonts" :key="font.name" :value="font">
                        {{ font.name }}
                    </option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="text-green-400">Background Color</label>
                <input type="color" v-model="backgroundColor"
                    class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
            </div>
            <div class="space-y-2">
                <label class="text-green-400">Border Color</label>
                <input type="color" v-model="borderColor"
                    class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
            </div>
            <div class="space-y-2">
                <label class="text-green-400">Text Size (px)</label>
                <input type="number" v-model="textSize" min="8" max="48"
                    class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
            </div>
            <div class="bg-green-800 p-4 rounded-lg">
                <canvas ref="canvas" class="w-full [image-rendering:pixelated] border border-green-700"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userText: '',
            selectedFont: null,
            fonts: [],
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            textSize: 16,
        };
    },
    mounted() {
        this.loadFonts();
    },
    watch: {
        userText: 'renderText',
        selectedFont: 'renderText',
        backgroundColor: 'renderText',
        borderColor: 'renderText',
        textSize: 'renderText',
    },
    methods: {
        loadFonts() {
            // Load your font sheets and predefined locations here
            // Example:
            const fontSheet = new Image();
            fontSheet.src = 'path/to/your/fontsheet.png';
            fontSheet.onload = () => {
                this.fonts.push({
                    name: 'Example Font',
                    sheet: fontSheet,
                    // Define character locations here
                    characters: {
                        A: { x: 0, y: 0, width: 8, height: 8 },
                        // Add other characters
                    },
                });
                this.selectedFont = this.fonts[0];
            };
        },
        renderText() {
            if (!this.selectedFont) return;

            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            canvas.width = this.userText.length * this.textSize;
            canvas.height = this.textSize;

            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#000000'; // Text color
            ctx.font = `${this.textSize}px PixelFont`;

            for (let i = 0; i < this.userText.length; i++) {
                const char = this.userText[i];
                const charData = this.selectedFont.characters[char];
                if (charData) {
                    ctx.drawImage(
                        this.selectedFont.sheet,
                        charData.x,
                        charData.y,
                        charData.width,
                        charData.height,
                        i * this.textSize,
                        0,
                        this.textSize,
                        this.textSize
                    );
                }
            }
        },
    },
};
</script>

<style scoped>
canvas {
    border: 1px solid #000;
    margin-top: 10px;
}
</style>