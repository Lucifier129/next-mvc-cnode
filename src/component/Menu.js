import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { connect } from '../shared/hoc'
import UserInfo from './UserInfo'

const withData = connect(({ state, handlers }) => {
	return {
		showMenu: state.showMenu,
		onClose: handlers.handleCloseMenu
	}
})

export default withData(Menu)

function Menu(props) {
	let className = classnames({
		'nav-list': true,
		show: props.showMenu
	})

	return (
		<section id="sideBar" className={className} onClick={props.onClose}>
			<UserInfo />
			<ul className="list-ul">
				<MenuItemWithCheck
					className="icon-quanbu iconfont"
					to={`/?tab=all`}
				>
					全部
				</MenuItemWithCheck>
				<MenuItemWithCheck className="icon-hao iconfont" to={`/?tab=good`}>
					精华
				</MenuItemWithCheck>
				<MenuItemWithCheck
					className="icon-fenxiang iconfont"
					to={`/?tab=share`}
				>
					分享
				</MenuItemWithCheck>
				<MenuItemWithCheck className="icon-wenda iconfont" to={`/?tab=ask`}>
					问答
				</MenuItemWithCheck>
				<MenuItemWithCheck
					className="icon-zhaopin iconfont"
					to={`/?tab=job`}
				>
					招聘
				</MenuItemWithCheck>
				<MenuItemWithCheck
					className="icon-xiaoxi iconfont line"
					to={`/message`}
				>
					消息
				</MenuItemWithCheck>
				<MenuItemWithCheck className="icon-about iconfont" to={`/about`}>
					关于
				</MenuItemWithCheck>
			</ul>
		</section>
	)
}

const withCurrentPath = connect(({ state }) => {
	return {
		current: state.location.raw
	}
})

const MenuItemWithCheck = withCurrentPath(MenuItem)

function MenuItem(props) {
	if (props.to === props.current) {
		let { to, current, ...rest } = props
		return <li {...rest} />
	}

	let { current, to, ...rest } = props
	return (
		<Link href={to}>
			<li {...rest} />
		</Link>
	)
}
