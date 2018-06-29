import Page from '../../shared/BasePage'
import * as Model from './Model'
import View from './View'

const { initialState, ...reducer } = Model

export default class extends Page {
	reducer = {
		...this.reducer,
		...reducer
	}
	View = View

	async getInitialState() {
		let state = await super.getInitialState()
		let { data: user } = await this.get(`/user/${this.props.query.name}`)
		return {
			...state,
			...initialState,
			user
		}
	}

	handleTypeChange = ({ currentTarget }) => {
		let { CHANGE_TYPE } = this.store.actions
		let type = currentTarget.getAttribute('data-type')
		CHANGE_TYPE(type)
	}
}
