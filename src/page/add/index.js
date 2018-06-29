import Page from '../../shared/BasePage'
import View from './View'
import * as Model from './Model'

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
		return {
			...initialState,
			...state
		}
	}

	handlePublish = async () => {
		let state = this.store.getState()
		let accesstoken = this.cookie('accesstoken')
		let { title, tab, content } = state

		if (title.length < 10) {
			this.showAlert('标题不能少于 10 字')
			return
		}

		if (content.length === 0) {
			this.showAlert('正文不能为空')
			return
		}

		let params = {
			accesstoken,
			title,
			tab,
			content
		}

		this.showLoading('发布中……')

		try {
			let { topic_id } = await this.post('/topics', params)
			let targetPath = `/topic?id=${topic_id}`
			this.redirect(targetPath)
		} catch (error) {
			this.showAlert(error.message)
		}

		this.hideLoading()
	}
}
