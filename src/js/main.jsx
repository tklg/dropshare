import React from 'react';
import ReactDOM from 'react-dom';

import Dropshare from 'views/Viewport.jsx';

ReactDOM.render(
	<Dropshare 
		simultaneousUploads={2}
	/>,
	document.getElementById('rr')
);
