import Page from '../../shared/BasePage'
import React from 'react'
import Layout from '../../component/Layout'

export default class extends Page {
	View = View
	async getInitialState() {
		let state = await super.getInitialState()
		return {
			...state,
			pageTitle: '关于'
		}
	}
}

function View() {
	return (
		<Layout>
			<dl className="about-info">
				<dt>关于项目</dt>
				<dd>基于 cnodejs 的 api，采用 next-mvc 编写的 web app</dd>
				<dt>next-mvc-cnode 源码地址</dt>
				<dd>
					<a href="https://github.com/Lucifier129/next-mvc-cnode">
						https://github.com/Lucifier129/next-mvc-cnode
					</a>
				</dd>
				<dt>next-mvc 源码地址</dt>
				<dd>
					<a href="https://github.com/Lucifier129/next-mvc">
						https://github.com/Lucifier129/next-mvc
					</a>
				</dd>
				<dt>意见反馈</dt>
				<dd>
					<a href="https://github.com/Lucifier129/next-mvc-cnode/issues">
						发表意见或者提需求
					</a>
				</dd>
				<dt>当前版本</dt>
				<dd>V1.0</dd>
			</dl>
		</Layout>
	)
}
