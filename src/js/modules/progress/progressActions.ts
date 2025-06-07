import '../../../scss/components/progress/progress-actions.scss'

import { ProgressBar } from './progressBar'

type ProgressActionsOptions = {
	value?: number
	animate?: boolean
	hide?: boolean
}
export class ProgressActions {
	private container: HTMLDivElement
	private bar: ProgressBar
	private options: ProgressActionsOptions

	constructor(bar: ProgressBar, options: ProgressActionsOptions = {}) {
		this.bar = bar
		this.options = {
			value: options.value ?? 75,
			animate: options.animate ?? false,
			hide: options.hide ?? false,
		}

		this.container = document.createElement('div')
		this.container.className = 'progress-actions'

		this.createControls()
	}

	private createInput(value: number) {
		const input = document.createElement('input')
		input.className =
			'progress-actions__item--control progress-actions__item--input'
		input.type = 'number'
		input.id = 'progress-value'
		input.value = `${value}`
		input.min = '0'
		input.max = '100'

		/* 
			В ТЗ не было уточнения, как обрабатывать неверные значения,
			поэтому решил повесить событие input и блокировать ввод некорректных значений сразу.
			Можно было бы также просто очищать поле и показывать ошибку.
		*/
		input.addEventListener('change', () => {
			const val = parseInt(input.value)
			if (!isNaN(val) && val >= 0 && val <= 100) {
				input.classList.remove('progress-actions__item--input_error')
				this.bar.setProgress(val)
			} else {
				input.value = '0'
				this.bar.setProgress(0)
			}
			/*
				else {
					input.classList.add('progress-actions__item--input_error')
					input.value = ''
					input.placeholder = '0 to 100'
					this.bar.setProgress(0)
				}
			*/
		})

		input.addEventListener('input', () => {
			let val = input.value

			val = val.replace(/[^0-9]/g, '')
			if (val !== '') {
				const num = parseInt(val)
				if (num > 100) {
					val = '100'
				} else if (num < 0) {
					val = '0'
				}
			}
			input.value = val
		})

		/* init filled bar */
		this.bar.setProgress(this.options.value || 0)
		return input
	}

	private createToggler(key: string) {
		const button = document.createElement('div')
		button.className =
			'progress-actions__item--control progress-actions__item--button'
		if (key === 'animate') {
			button.classList.add('progress-actions__item--button_animate')
		} else if (key === 'hide') {
			button.classList.add('progress-actions__item--button_hide')
		}
		const toggler = document.createElement('div')
		toggler.className = 'progress-actions__item--toggler'

		button.append(toggler)

		button.addEventListener('click', () => {
			if (key === 'animate' && !this.options.hide) {
				button.classList.toggle('progress-actions__item--button_animate_active')
				this.bar.toggleAnimate()
				this.options.animate = !this.options.animate
			} else if (key === 'hide') {
				if (this.options.animate) {
					console.log('hi')
					this.container
						.querySelector('.progress-actions__item--button_animate')
						?.classList.toggle('progress-actions__item--button_animate_active')
					this.options.animate = !this.options.animate
					this.bar.toggleAnimate()
				}
				button.classList.toggle('progress-actions__item--button_hide_active')
				this.options.hide = !this.options.hide
				this.bar.toggleHide()
			}
		})

		/* init buttons state */
		if (key === 'animate') {
			if (this.options.animate) {
				button.classList.toggle('progress-actions__item--button_animate_active')
				this.bar.toggleAnimate()
			}
		}
		if (key === 'hide') {
			if (this.options.hide) {
				button.classList.toggle('progress-actions__item--button_hide_active')
				this.bar.toggleHide()
			}
		}

		return button
	}

	private createControls() {
		Object.entries(this.options).forEach(([key, value]) => {
			const wrapper = document.createElement('div')
			wrapper.className = 'progress-actions__item'

			const label = document.createElement('span')
			label.className = 'progress-actions__item--title'
			label.textContent = key

			if (typeof value === 'number') {
				const input = this.createInput(value)
				wrapper.append(input, label)
			} else if (typeof value === 'boolean') {
				const button = this.createToggler(key)
				wrapper.append(button, label)
			}

			this.container.append(wrapper)
		})
	}

	mount(parent: HTMLElement) {
		parent.appendChild(this.container)
	}
}
