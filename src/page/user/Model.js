/**
 * Model
 */
export const initialState = {
	pageTitle: '用户',
	user: null,
	type: 'replies',
	currentData: []
}

export const CHANGE_TYPE = (state, type) => {
	return {
		...state,
		type
	}
}
