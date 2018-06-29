import Page from '../../shared/BasePage'
import * as Model from './Model'
import View from './View'

const { initialState, ...reducer } = Model

export default class extends Page {
	NeedLogin = true
	View = View

	reducer = {
		...this.reducer,
		...reducer
	}

	async getInitialState() {
		let state = await super.getInitialState()
		let accesstoken = this.cookie('accesstoken')
		let url = `/messages?accesstoken=${accesstoken}`
		let { data } = await this.get(url)
		let tab = data.hasnot_read_messages.length > 0 ? 'hasNotRead' : 'hasRead'
		return {
			...state,
			...initialState,
			tab,
			hasRead: data.has_read_messages,
			hasNotRead: data.hasnot_read_messages
		}
	}

	handleTabChange = ({ currentTarget }) => {
		let tab = currentTarget.getAttribute('data-tab')
		let { CHANGE_TAB } = this.store.actions
		CHANGE_TAB(tab)
	}

	handleMarkAll = async () => {
		try {
			let url = `/message/mark_all`
			let accesstoken = this.cookie('accesstoken')
			await this.post(url, { accesstoken })
		} catch (error) {
			this.showAlert(error.message)
		}
	}
}
