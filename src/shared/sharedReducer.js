import { setValueByPath } from './util'

export const UPDATE_INPUT_VALUE = (state, payload) => {
	return Object.keys(payload).reduce(
		(state, path) => setValueByPath(state, path, payload[path]),
		state
	)
}

export const UPDATE_HTML_TITLE = (state, title) => {
	let html = {
		...state.html,
		title
	}
	return {
		...state,
		html
	}
}

export const OPEN_MENU = state => {
	if (state.showMenu) {
		return state
	}
	return {
		...state,
		showMenu: true
	}
}

export const CLOSE_MENU = state => {
	if (!state.showMenu) {
		return state
	}
	return {
		...state,
		showMenu: false
	}
}

export const UPDATE_ALERT_TEXT = (state, alertText) => {
	return {
		...state,
		alertText
	}
}

export const UPDATE_LOADING_TEXT = (state, loadingText) => {
	return {
		...state,
		loadingText
	}
}
