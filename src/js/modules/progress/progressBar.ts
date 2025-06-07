import '../../../scss/components/progress/progress-bar.scss'

type BarStyleOptions = {
	size: number
	strokeWidth: number
	strokeLinecap: string
	bgColor: string
	fillColor: string
}
type ProgressBarOptions = {
	currentPercent?: number
	isAnimated?: boolean
	isHidden?: boolean
	barOptions?: BarStyleOptions
}

const defaultBarOptions: BarStyleOptions = {
	size: 222,
	strokeWidth: 10,
	strokeLinecap: 'butt',
	bgColor: '#EFF3F6',
	fillColor: '#0061FF',
}

export class ProgressBar {
	private container: HTMLDivElement
	private bar: SVGSVGElement
	private circle: SVGCircleElement
	private circumference: number
	private animationId: number | null = null
	private rotation = 0

	private isAnimated: boolean
	private isHidden: boolean
	private currentPercent: number

	constructor(options: ProgressBarOptions = {}) {
		const {
			currentPercent = 75,
			isAnimated = false,
			isHidden = false,
			barOptions = {},
		} = options

		this.currentPercent = currentPercent
		this.isAnimated = isAnimated
		this.isHidden = isHidden

		const mergedBarOptions = { ...defaultBarOptions, ...barOptions }

		document.documentElement.style.setProperty(
			'--bar-width',
			`${mergedBarOptions.size}px`
		)

		const radius = Math.floor(
			mergedBarOptions.size / 2 - mergedBarOptions.strokeWidth / 2
		)
		this.circumference = 2 * Math.PI * radius

		this.container = document.createElement('div')
		this.container.className = 'progress-bar'

		this.bar = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		this.bar.setAttribute('class', 'progress-bar__svg')
		this.bar.setAttribute(
			'viewBox',
			`0 0 ${mergedBarOptions.size} ${mergedBarOptions.size}`
		)
		this.bar.setAttribute('width', `${mergedBarOptions.size}`)
		this.bar.setAttribute('height', `${mergedBarOptions.size}`)

		this.bar.style.transform = 'rotate(-90deg)'

		const bgBar = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle'
		)
		bgBar.setAttribute('stroke', `${mergedBarOptions.bgColor}`)
		bgBar.setAttribute('stroke-width', `${mergedBarOptions.strokeWidth}`)
		bgBar.setAttribute('fill', 'transparent')
		bgBar.setAttribute('r', `${radius}`)
		bgBar.setAttribute('cx', `${Math.floor(mergedBarOptions.size / 2)}`)
		bgBar.setAttribute('cy', `${Math.floor(mergedBarOptions.size / 2)}`)

		/* filled bar */
		this.circle = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle'
		)
		this.circle.setAttribute('class', 'progress-bar__svg--circle')
		this.circle.setAttribute('stroke', `${mergedBarOptions.fillColor}`)
		this.circle.setAttribute('stroke-width', `${mergedBarOptions.strokeWidth}`)
		this.circle.setAttribute(
			'stroke-linecap',
			`${mergedBarOptions.strokeLinecap}`
		)
		this.circle.setAttribute('stroke-dasharray', `${this.circumference}`)
		this.circle.setAttribute('stroke-dashoffset', `${this.circumference}`)
		this.circle.setAttribute('fill', 'transparent')
		this.circle.setAttribute('r', `${radius}`)
		this.circle.setAttribute('cx', `${Math.floor(mergedBarOptions.size / 2)}`)
		this.circle.setAttribute('cy', `${Math.floor(mergedBarOptions.size / 2)}`)

		this.bar.append(bgBar, this.circle)
		this.container.append(this.bar)
	}

	setProgress(percent: number) {
		const start = performance.now()
		const startPercent = this.currentPercent
		const endPercent = percent
		const duration = 600

		const animate = (time: number) => {
			let timeFraction = (time - start) / duration
			if (timeFraction > 1) timeFraction = 1

			const timing =
				timeFraction <= 0.5
					? 4 * Math.pow(timeFraction, 3)
					: 1 - Math.pow(2 * (1 - timeFraction), 3) / 2

			const currentPercent = startPercent + (endPercent - startPercent) * timing
			const offset = (1 - currentPercent / 100) * this.circumference

			this.circle.setAttribute('stroke-dashoffset', `${offset}`)

			if (timeFraction < 1) {
				requestAnimationFrame(animate)
			} else {
				this.currentPercent = percent
			}
		}

		requestAnimationFrame(animate)
	}

	toggleAnimate() {
		if (
			!this.isAnimated &&
			this.currentPercent > 0 &&
			this.currentPercent < 100 &&
			!this.isHidden
		) {
			const step = () => {
				this.rotation = (this.rotation + 6) % 360
				const totalRotation = this.rotation - 90
				this.bar.style.transform = `rotate(${totalRotation}deg)`
				this.animationId = requestAnimationFrame(step)
			}
			this.animationId = requestAnimationFrame(step)
		} else {
			if (this.animationId !== null) {
				cancelAnimationFrame(this.animationId)
				this.animationId = null
				this.rotation = 0
				this.bar.style.transform = 'rotate(-90deg)'
			}
		}
		this.isAnimated = !this.isAnimated
	}

	toggleHide() {
		if (!this.isHidden) {
			this.container.style.display = 'none'
		} else {
			this.container.style.display = 'block'
		}
		this.isHidden = !this.isHidden
	}

	mount(parent: HTMLElement) {
		parent.appendChild(this.container)
	}
}
