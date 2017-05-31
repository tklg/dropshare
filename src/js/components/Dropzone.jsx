import React from 'react';
import ListItem from '../components/ListItem.jsx';

const DZ = {
	STATUS_WAITING: 0,
	STATUS_UPLOADING: 1,
	STATUS_FINISHED: 2,
	STATUS_FAILED: 3,
	STATUS_PAUSED: 4,
	STATUS_CANCELLED: 5,
}
export default class Dropzone extends React.Component {
	constructor() {
		super();
		this.state = {
			dragging: null,
		}
		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	onDragEnter(e) {
		e.preventDefault();
		this.setState({
			dragging: true,
		})
	}
	onDragLeave(e) {
		e.preventDefault();
		this.setState({
			dragging: null,
		})
	}
	onDrop(e) {
		e.preventDefault();
		e.stopPropagation();
		var nFiles = e.dataTransfer.files;
		var files = [];
		for (var i = 0; i < nFiles.length; i++) {
			files.push(nFiles.item(i));
		}
		files = files.map((x, i) => {
			return {
				status: DZ.STATUS_WAITING,
				data: x,
				progress: 0,
			};
		});
		this.setState({
			dragging: null,
		}, () => {
			this.props.onDrop(files);
		})
	}
	onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		var nFiles = e.target.files;
		var files = [];
		for (var i = 0; i < nFiles.length; i++) {
			files.push(nFiles.item(i));
		}
		files = files.map((x, i) => {
			return {
				status: DZ.STATUS_WAITING,
				data: x,
				progress: 0,
			};
		});
		this.props.onDrop(files);
	}
	render() {
		return (
			<div className={"drop" + (this.props.small ? ' small' : '')} onDragOver={this.onDragEnter} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
				<label className={"center-icon" + (this.state.dragging ? ' dragging' : '')} htmlFor="file-input">
					<i className="mdi mdi-arrow-up-bold"></i>
					<span>Upload files</span>
				</label>
				<input type="file" name="files" multiple="multiple" id="file-input" onChange={this.onSubmit}/>
			</div>
		);
	}
}

export {DZ};