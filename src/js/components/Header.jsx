import React from 'react';

export default class Header extends React.Component {
	constructor() {
		super();
		this.getTitle = this.getTitle.bind(this);
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	getTitle() {
		return "Dropshare";
	}
	render() {
		return (
			<header className="header">
				<h1 className="title">Dropshare</h1>
				<span>
					{(this.props.success > 0 || this.props.fail > 0) && "Uploaded: " + this.props.success + ", Failed: " + this.props.fail}
				</span>
			</header>
		);
	}
}
