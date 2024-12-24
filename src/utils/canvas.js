import { fonts } from '../assets/fonts'

export const drawGlyph = async (ctx, options) => {
    const { 
        text,
        font,
        textColor,
        patterns,
        leftWidth,
        middleWidth,
        rightWidth,
        charSpacing = 1,
        spaceWidth = 3
    } = options

    // Calculate dimensions
    const chars = text.split('')
    const textWidth = chars.reduce((width, char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') return width + spaceWidth
        const charData = font.characters.find(c => c.char === char)
        return width + (charData ? charData.matrix[0].length + (isLast ? 0 : charSpacing) : 1)
    }, 0)

    const finalWidth = textWidth + leftWidth + rightWidth
    ctx.canvas.width = finalWidth
    ctx.canvas.height = 10
    ctx.clearRect(0, 0, finalWidth, 10)

    // Draw middle pattern
    let x = leftWidth
    while (x < leftWidth + textWidth) {
        patterns.middle.forEach((row, y) => {
            row.forEach((pixel, px) => {
                if (pixel.active) {
                    ctx.fillStyle = pixel.color
                    ctx.fillRect(x + (px % middleWidth), y, 1, 1)
                }
            })
        })
        x += middleWidth
    }

    // Draw text
    let currentX = leftWidth
    chars.forEach((char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') {
            currentX += spaceWidth
            return
        }
        const charData = font.characters.find(c => c.char === char)
        if (charData) {
            ctx.fillStyle = textColor
            charData.matrix.forEach((row, y) => {
                row.forEach((pixel, x) => {
                    if (pixel) ctx.fillRect(currentX + x, y, 1, 1)
                })
            })
            currentX += charData.matrix[0].length + (isLast ? 0 : charSpacing)
        }
    })

    // Draw left decoration
    patterns.left.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                ctx.fillStyle = pixel.color
                ctx.fillRect(x, y, 1, 1)
            }
        })
    })

    // Draw right decoration
    patterns.right.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                ctx.fillStyle = pixel.color
                ctx.fillRect(finalWidth - rightWidth + x, y, 1, 1)
            }
        })
    })

    return { width: finalWidth, height: 10 }
}