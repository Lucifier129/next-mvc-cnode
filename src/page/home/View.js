import React from 'react'
import Link from 'next/link'
import { purify } from '../../shared/hoc'
import Layout from '../../component/Layout'
import * as _ from '../../shared/util'

export default function View({ state }) {
	return (
		<Layout>
			<section id="page">
				<ul className="posts-list">
					{state.topics.map(topic => <PureTopic {...topic} key={topic.id} />)}
				</ul>
			</section>
		</Layout>
	)
}

const PureTopic = purify()(Topic)

function Topic(props) {
	let {
		id,
		title,
		good,
		top,
		tab,
		author,
		reply_count,
		create_at,
		last_reply_at,
		visit_count
	} = props
	return (
		<Link href={`/topic?id=${id}`}>
			<li>
				<h3
					className={_.getTabClassName(tab, good, top)}
					title={_.getTabStr(tab, good, top)}
				>
					{title}
				</h3>
				<div className="content">
					<img className="avatar" src={author.avatar_url} />
					<div className="info">
						<p>
							<span className="name">{author.loginname}</span>
							{reply_count > 0 && (
								<span className="status">
									<b>{reply_count}</b>/{visit_count}
								</span>
							)}
						</p>
						<p>
							<time>{_.getLastTimeStr(create_at, true)}</time>
							<time>{_.getLastTimeStr(last_reply_at, true)}</time>
						</p>
					</div>
				</div>
			</li>
		</Link>
	)
}
