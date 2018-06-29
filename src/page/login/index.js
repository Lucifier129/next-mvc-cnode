import React from 'react'
import Input from '../../component/Input'
import Layout from '../../component/Layout'
import Page from '../../shared/BasePage'

export default class extends Page {
	View = View

	async getInitialState() {
		let state = await super.getInitialState()
		// 如果已经登陆，重定向离开
		if (state.isLogin) {
			let { userInfo } = state
			let targetPath = this.props.query.redirect
			if (!targetPath) {
				targetPath = `/user?name=${userInfo.loginname}`
			}
			this.redirect(targetPath)
			return
		}
		return {
			...state,
			pageTitle: '登录',
			token: ''
		}
	}

	handleLogin = async () => {
		let { token } = this.store.getState()

		if (!token || token.length !== 36) {
			this.showAlert('令牌格式错误, 应为36位UUID字符串')
			return
		}

		this.showLoading('登录中……')

		try {
			let userInfo = await this.fetchUserInfo(token)

			if (!userInfo) {
				throw new Error('登陆失败，请重试')
			}

			this.cookie('accesstoken', token)
			window.location.reload()
		} catch (error) {
			this.showAlert(error.message)
		}

		this.hideLoading()
	}
}

function View({ page }) {
	return (
		<Layout>
			<section className="page-body">
				<div className="label">
					<Input
						name="token"
						className="txt"
						type="text"
						placeholder="Access Token"
						maxLength="36"
					/>
				</div>
				<div className="label">
					<button className="button" onClick={page.handleLogin}>
						登录
					</button>
				</div>
			</section>
		</Layout>
	)
}
