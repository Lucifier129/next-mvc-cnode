import Page from '../../shared/BasePage'
import View from './View'
import * as Model from './Model'
import * as _ from '../../shared/util'

const { initialState, ...reducer } = Model
const replySuffix = `\n来自 [next-mvc-cnode](https://github.com/Lucifier129/next-mvc-cnode)`

export default class extends Page {
	KeepAlive = true
	View = View

	reducer = {
		...this.reducer,
		...reducer
	}

	async getInitialState() {
		let state = await super.getInitialState()
		let topic = await this.getTopic()
		return {
			...initialState,
			...state,
			topic
		}
	}

	async getTopic() {
		try {
			let { data } = await this.get(`/topic/${this.props.query.id}`)
			return data
		} catch (error) {
			return null
		}
	}

	handleToggleReplyForm = ({ currentTarget }) => {
		if (!this.checkLogin()) {
			return
		}
		let { TOGGLE_REPLY_FORM } = this.store.actions
		let activeReplyId = currentTarget.getAttribute('data-id')
		TOGGLE_REPLY_FORM({ activeReplyId })
	}

	handleLikeReply = async ({ currentTarget }) => {
		if (!this.checkLogin()) {
			return
		}
		let { LIKE_REPLY } = this.store.actions
		let replyId = currentTarget.getAttribute('data-id')

		try {
			let { action } = await this.likeReply(replyId)
			LIKE_REPLY({ action, replyId })
		} catch (error) {
			this.showAlert(error.message)
		}
	}

	handleReplyTopic = async ({ currentTarget }) => {
		if (!this.checkLogin()) {
			return
		}
		let { REPLY_TO_TOPIC } = this.store.actions
		let state = this.store.getState()
		let params = {
			content: state.replyOfTopic
		}

		this.showLoading('回复中……')

		try {
			let data = await this.postReply(params)
			let { reply_id: replyId, content } = data
			REPLY_TO_TOPIC({ replyId, content })
		} catch (error) {
			this.showAlert(error.message)
		}

		this.hideLoading()
	}

	handleReplyOther = async ({ currentTarget }) => {
		if (!this.checkLogin()) {
			return
		}
		let { REPLY_TO_OTHER } = this.store.actions
		let state = this.store.getState()
		let replyId = currentTarget.getAttribute('data-id')
		let params = {
			replyId: replyId,
			content: state.replyOfOthers[replyId]
		}

		this.showLoading('回复中……')

		try {
			let data = await this.postReply(params)
			let { reply_id: newReplyId, content } = data
			REPLY_TO_OTHER({ replyId, newReplyId, content })
		} catch (error) {
			this.showAlert(error.message)
		}

		this.hideLoading()
	}

	checkLogin() {
		if (!this.isLogin()) {
			this.goto(`/login?redirect=${this.props.asPath}`)
			return false
		}
		return true
	}

	likeReply(replyId) {
		let url = `/reply/${replyId}/ups`
		let accesstoken = this.cookie('accesstoken')
		return this.post(url, { accesstoken })
	}

	async postReply({ content, replyId }) {
		if (!content || content.length <= 10) {
			throw new Error('评论内容不能少于10个字')
		}

		content = _.linkUsers(content) + replySuffix

		let topicId = this.props.query.id
		let url = `/topic/${topicId}/replies`
		let accesstoken = this.cookie('accesstoken')
		let params = { accesstoken, content }

		if (replyId) {
			params['reply_id'] = replyId
		}
		let data = await this.post(url, params)

		return {
			...data,
			content
		}
	}
}
