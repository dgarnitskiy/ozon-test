import '../scss/main.scss'

import { ProgressActions, ProgressBar } from './modules/progress'

const progressBarElement = document.querySelector(
	'#progress-bar'
) as HTMLDivElement
const progressActionsElement = document.querySelector(
	'#progress-actions'
) as HTMLDivElement

const bar = new ProgressBar()
const actions = new ProgressActions(bar)

if (progressBarElement) {
	bar.mount(progressBarElement)
}
if (progressActionsElement) {
	actions.mount(progressActionsElement)
}
