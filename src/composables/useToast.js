// useToast.js
import { ref, h, render } from 'vue'
import Toast from '../components/Toast.vue'

export function useToast() {
    const createToast = (message, options = {}) => {
        const container = document.createElement('div')
        document.body.appendChild(container)

        const vnode = h(Toast, {
            message,
            duration: options.duration || 3000,
            type: options.type || 'success',
            onDestroy: () => {
                document.body.removeChild(container)
            }
        })

        render(vnode, container)
    }

    return {
        success: (message, options = {}) => createToast(message, { ...options, type: 'success' }),
        error: (message, options = {}) => createToast(message, { ...options, type: 'error' })
    }
}