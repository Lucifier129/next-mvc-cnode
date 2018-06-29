import React from 'react'
import { Page } from 'next-mvc'
import querystring from 'querystring'
import sharedInitialState from './sharedInitialState'
import * as sharedReducer from './sharedReducer'

const { Provider, Consumer } = React.createContext()

export default class BasePage extends Page {
	static Provider = Provider
	static Consumer = Consumer

	render() {
		return <Provider value={this}>{super.render()}</Provider>
	}

	immer = false

	reducer = sharedReducer
	// fetch(url) 的 api 前缀
	apiPrefix = 'https://cnodejs.org/api/v1'
	// 拓展字段：是否需要登录才可以访问
	NeedLogin = false
	async getInitialState() {
		let userInfo = await this.getUserInfo()
		let isLogin = !!userInfo
		let showAddButton = isLogin
		let location = {
			pathname: this.props.pathname,
			query: this.props.query,
			raw: this.props.asPath,
		}

		// 如果需要登录却没登录，去登录页
		if (this.NeedLogin && !isLogin) {
			return this.redirect(`/login?redirect=${this.props.asPath}`)
		}

		return {
			...sharedInitialState,
			location,
			showAddButton,
			userInfo,
			isLogin
		}
	}

	async getUserInfo() {
		let accesstoken = this.cookie('accesstoken')
		let userInfo = await this.fetchUserInfo(accesstoken)
		return userInfo
	}

	isLogin() {
		return !!this.state.userInfo
	}

	async fetchUserInfo(accesstoken) {
		if (!accesstoken) {
			return null
		}

		let data = await this.post('/accesstoken', { accesstoken })
		let { success, error_msg, ...userInfo } = data
		return userInfo
	}

	// 封装 get 方法，处理 cnode 跨域要求
	get(api, params, options = {}) {
		options = {
			...options,
			credentials: 'omit',
			headers: {
				...options.headers,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		return super.get(api, params, options)
	}

	// 封装 post 方法，处理 cnode 跨域要求
	post(api, params, options = {}) {
		options = {
			...options,
			credentials: 'omit',
			method: 'POST',
			headers: {
				...options.headers,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: querystring.stringify(params)
		}
		return this.fetch(api, options)
	}

	// 统一抛错, get/post 方法底层调用的是 fetch 方法
	async fetch(url, options) {
		let data = await super.fetch(url, options)
		let { success, error_msg } = data
		if (!success) {
			throw new Error(error_msg)
		}
		return data
	}

	// 隐藏提示信息
	hideAlert = () => {
		let { UPDATE_ALERT_TEXT } = this.store.actions
		UPDATE_ALERT_TEXT('')
	}

	// 显示提示信息
	showAlert = text => {
		let { UPDATE_ALERT_TEXT } = this.store.actions
		UPDATE_ALERT_TEXT(text)
		setTimeout(this.hideAlert, 1000)
	}

	showLoading = content => {
		let { UPDATE_LOADING_TEXT } = this.store.actions
		UPDATE_LOADING_TEXT(content)
	}

	hideLoading = () => {
		let { UPDATE_LOADING_TEXT } = this.store.actions
		UPDATE_LOADING_TEXT('')
	}

	// 打开菜单
	handleOpenMenu = () => {
		let { OPEN_MENU } = this.store.actions
		OPEN_MENU()
	}

	// 关闭菜单
	handleCloseMenu = () => {
		let { CLOSE_MENU } = this.store.actions
		CLOSE_MENU()
	}

	// 退出登陆
	handleLogout = () => {
		this.removeCookie('accesstoken')
		window.location.reload()
	}
}
