import React from 'react'
import Page from './BasePage'

export let purify = () => InputComponent => {
	return class Pure extends React.PureComponent {
		render() {
			return <InputComponent {...this.props} />
		}
	}
}

export let staticify = () => InputComponent => {
	return class Static extends React.Component {
		shouldComponentUpdate() {
			return false // always false to make sure just rendering once
		}
		render() {
			return <InputComponent {...this.props} />
		}
	}
}

export let connect = selector => Component => {
	if (!Component) throw new Error(`Component should not be ${Component === null ? 'null' : typeof Component}`)
	return props => {
		return (
			<Page.Consumer>
				{page => (
					<Component
						{...selector({ state: page.state, handlers: page })}
						{...props}
					/>
				)}
			</Page.Consumer>
		)
	}
	
}