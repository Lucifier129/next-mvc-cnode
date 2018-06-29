import React, { Component } from 'react'
import * as _ from '../shared/util'
import { connect } from '../shared/hoc'

const { getValueByPath } = _

const withData = connect(({ state, handlers }) => {
	return {
		state,
		actions: handlers.actions
	}
})

class Input extends Component {
	static defaultProps = {
		as: 'input',
		type: 'text',
		name: '',
		actionType: 'UPDATE_INPUT_VALUE'
	}
	render() {
		let {
			state,
			actions,
			as,
			name,
			value,
			check,
			actionType,
			transformer,
			...subProps
		} = this.props
		let Tag = as

		let path = check ? `${name}.value` : name

		if (value === undefined) {
			value = getValueByPath(state, path)
		}

		subProps.value = value
		subProps.name = name
		subProps.onChange = this.handleChange
		if (check) {
			subProps.onFocus = this.handleFocus
			subProps.onBlur = this.handleBlur
		}

		return <Tag {...subProps} />
	}
	getAction() {
		return this.props.actions[this.props.actionType]
	}
	callAction(actionPayload) {
		this.getAction()(actionPayload)
	}
	handleChange = event => {
		let { state, name, onChange, check, transformer } = this.props
		let currentValue = event.currentTarget.value
		let path = check ? `${name}.value` : name
		let oldValue = getValueByPath(state, path)

		if (typeof transformer === 'function') {
			currentValue = transformer(currentValue, oldValue)
		}

		this.callAction({
			[path]: currentValue
		})

		onChange && onChange(event)
	}
	handleFocus = event => {
		let { state, name, onFocus } = this.props
		let path = `${name}.isWarn`
		let isWarn = getValueByPath(state, path)
		if (!isWarn) {
			onFocus && onFocus(event)
			return
		}
		this.callAction({
			[path]: false
		})
		onFocus && onFocus(event)
	}
	handleBlur = event => {
		let { name, onBlur, check } = this.props
		let pathOfValidState = `${name}.isValid`
		let pathOfWranState = `${name}.isWarn`
		let isValidValue = check(event.currentTarget.value)
		this.callAction({
			[pathOfValidState]: isValidValue,
			[pathOfWranState]: !isValidValue
		})
		onBlur && onBlur(event)
	}
}

export default withData(Input)
