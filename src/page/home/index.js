import Page from '../../shared/BasePage'
import * as _ from '../../shared/util'
import * as Model from './Model'
import View from './View'

const { initialState, ...reducer } = Model

export default class HomdePage extends Page {
	View = View
	reducer = {
		...this.reducer,
		...reducer
	}

	// 动态构造初始化数据，从查询字符串里获取数据
	async getInitialState() {
		let state = await super.getInitialState()
		state = {
			...initialState,
			...state
		}
		let query = state.location.query
		let searchParams = { ...state.searchParams }
		let pageTitle = state.pageTitle

		if (query.tab) {
			searchParams.tab = query.tab
			pageTitle = _.getTitleByTab(query.tab)
		}

		let { data } = await this.get('/topics', searchParams)
		let topics = data.map(item => {
			let { content, ...topic } = item
			return topic
		})

		return {
			...initialState,
			...state,
			topics,
			pageTitle,
			searchParams
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

	// 是否正在获取数据
	isFetching = false
	// 滚动到底部时，加载新的数据
	handleScroll = async () => {
		let { SCROLL_TO_BOTTOM } = this.store.actions
		let state = this.store.getState()

		// 如果正在请求，或者呼出了菜单栏，则不去获取新数据
		if (this.isFetching || state.showMenu) {
			return
		}

		let scrollHeight = window.innerHeight + window.scrollY
		let pageHeight =
			document.body.scrollHeight || document.documentElement.scrollHeight

		if (pageHeight - scrollHeight <= 400) {
			let searchParams = {
				...state.searchParams,
				page: state.searchParams.page + 1
			}
			this.isFetching = true
			let { data } = await this.get('/topics', searchParams)
			SCROLL_TO_BOTTOM({
				data,
				searchParams
			})
			this.isFetching = false
		}
	}

	render() {
		this
		return super.render()
	}
}
