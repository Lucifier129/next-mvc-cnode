import React from 'react'
import Link from 'next/link'
import { connect } from '../shared/hoc'

const withData = connect(({ state, handlers }) => {
	return {
		location: state.location,
		userInfo: state.userInfo,
		user: state.user,
		onLogout: handlers.handleLogout
	}
})

export default withData(UserInfo)

function UserInfo({ location, userInfo, user, onLogout }) {
	let showLogout =
		location.pathname.startsWith('/user') &&
		userInfo &&
		user &&
		userInfo.loginname === user.loginname
	return (
		<div className="user-info">
			<User if={!showLogout && userInfo} info={userInfo} />
			<Login if={!showLogout && !userInfo} redirect={location.raw} />
			<Logout if={showLogout} onLogout={onLogout} />
		</div>
	)
}

function Login(props) {
	if (!props.if) {
		return null
	}

	return (
		<ul className="login-no">
			<Link href={`/login?redirect=${props.redirect}`}>
				<li className="login">登录</li>
			</Link>
		</ul>
	)
}

function Logout(props) {
	if (!props.if) {
		return null
	}

	return (
		<ul className="login-no">
			<li className="login" onClick={props.onLogout}>
				退出
			</li>
		</ul>
	)
}

function User(props) {
	if (!props.if) {
		return null
	}
	let { loginname, avatar_url } = props.info
	return (
		<Link href={`/user?name=${loginname}`}>
			<div className="login-yes">
				<div className="avertar">{avatar_url && <img src={avatar_url} />}</div>
				<div className="info">{loginname && <p>{loginname}</p>}</div>
			</div>
		</Link>
	)
}
