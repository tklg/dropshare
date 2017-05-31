import React from 'react';
import {DZ} from './Dropzone.jsx';

export default class ListItem extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	render() {
		var progress;
		if (this.props.progress >= this.props.item.size) progress = 'Done';
		else if (this.props.progress > 0) progress = Math.min(Math.ceil(this.props.progress / this.props.item.size * 100), 100) + "%";
		else progress = 'Waiting';
		if (this.props.status == DZ.STATUS_CANCELLED) progress = 'Cancelled';
		else if (this.props.status == DZ.STATUS_FAILED) progress = 'Failed';
		return (
			<li className={this.props.progress > 0 && this.props.progress < this.props.item.size ? 'active' : ''}>
				<div className="info-container">
					<span className="title">{this.props.item.name}</span>
					{/*<span className="progress">{this.props.progress + "/" + this.props.item.size + " bytes"}</span>*/}
					<span className="progress">{progress}</span>
				</div>
				<div className="progress-bar-container">
					<div className="progress-bar" style={{width: this.props.progress / this.props.item.size * 100 + "%"}}></div>
				</div>
				{progress != 'Done' && <i className="mdi mdi-close-circle-outline" onClick={this.props.onCancel}></i>}
			</li>
		);
	}
}
