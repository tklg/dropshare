import React from 'react';

import Header from '../components/Header.jsx';
import Dropzone, {DZ} from '../components/Dropzone.jsx';
import ListItem from '../components/ListItem.jsx';
import Infinite from 'react-infinite';

export default class Dropshare extends React.Component {
	constructor() {
		super();
		this.state = {
			height: 1280,
			width: 1920,
			uploads: [],
			success: 0,
			fail: 0,
		}
		this.addFileToUploadQueue = this.addFileToUploadQueue.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.startUploads = this.startUploads.bind(this);
		//this.getListItem = this.getListItem.bind(this);
		this.upload = this.upload.bind(this);
		this.cancelUpload = this.cancelUpload.bind(this);
		this.hasMoreUploads = this.hasMoreUploads.bind(this);
		this.getNextFileToUpload = this.getNextFileToUpload.bind(this);
	}
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}
	updateWindowDimensions() {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight - 50,
		});
	}
	addFileToUploadQueue(nFiles) {
		var files = this.state.uploads.concat(nFiles);
		this.setState({
			uploads: files,
		}, () => {
			if (!this.state.isUploading) {
				this.setState({
					isUploading: true,
				}, () => {
					for (var i = 0; i < (this.props.simultaneousUploads || 1) && i < this.state.uploads.length; i++) this.upload();
				})
			}
		})
	}
	startUploads() {
		this.upload();
	}
	upload() {
		if (!this.hasMoreUploads()) return;
		var f = this.getNextFileToUpload();

		var fd = new FormData();
		fd.append('file', f.data);

		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = e => {
			if (e.lengthComputable) {
				f.progress = e.loaded;
				this.forceUpdate();
				/*var uploads = this.state.uploads;
				uploads[0] = f;
				this.setState({
					uploads,
				})*/
			}
		};
		xhr.onload = () => {
			//console.log(xhr.response);
			var files = this.state.uploads;
			//status.shift();
			this.setState({
				uploads: files,
			}, () => {
				if (this.hasMoreUploads()) {
					this.upload();
				} else {
					// finished uploading
					this.setState({
						isUploading: null,
					})
				}
				if (xhr.response == 'ok') {
					f.status = DZ.STATUS_FINSHED;
					var s = this.state.success;
					s++;
					this.setState({
						success: s,
					})
				} else {
					f.status = DZ.STATUS_FAILED;
					var s = this.state.fail;
					s++;
					this.setState({
						fail: s,
					})
				}
			});
		}
		xhr.onerror = () => {
			f.status = DZ.STATUS_FAILED;
			var s = this.state.fail;
			s++;
			this.setState({
				fail: s,
			})
		}
		xhr.open('POST', '/dropshare/api/upload.php');
		xhr.send(fd);
		f.xhr = xhr;
		f.status = DZ.STATUS_UPLOADING;
		this.forceUpdate();
	}
	cancelUpload(file) {
		file.xhr.abort();
		file.progress = 0;
		file.status = DZ.STATUS_CANCELLED;
		this.forceUpdate();
	}
	hasMoreUploads() {
		for (var i = 0; i < this.state.uploads.length; i++) {
			if (this.state.uploads[i].status == DZ.STATUS_WAITING) {
				return true;
			}
		}
		return false;
	}
	getNextFileToUpload() {
		var i = 0;
		while (this.state.uploads[i] && this.state.uploads[i].status != DZ.STATUS_WAITING) i++;
		return this.state.uploads[i];
	}
	render() {
		return (
			<div className="root">
				<Header 
					success={this.state.success}
					fail={this.state.fail}
				/>
				<section className="content">
					<Infinite
						className={"list" + (!this.state.uploads.length ? ' hidden' : '')}
						containerHeight={this.state.height}
						elementHeight={50}
					>
						{!!this.state.uploads.length && this.state.uploads.map((x, i) => <ListItem 
							key={i} 
							item={x.data}
							progress={x.progress}
							status={x.status}
							onCancel={() => this.cancelUpload(x)}
						/>)}
					</Infinite>
					<Dropzone 
						onDrop={this.addFileToUploadQueue}
						small={!!this.state.uploads.length}
					/>
				</section>
			</div>
		);
	}
}
