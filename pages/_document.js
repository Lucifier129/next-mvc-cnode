import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

export default class Doc extends Document {
	render() {
		return (
			<html>
				<Head>
					<link rel="stylesheet" href="/static/css/main.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}
