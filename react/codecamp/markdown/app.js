//16.12.25 
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './node_modules/bootstrap/scss/bootstrap.scss';

class Contain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content:'Heading\n=======\n\nSub-heading\n-----------\n \n### Another deeper heading\n \nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  \nline break\n\nText attributes *italic*, **bold**, \n`monospace`, ~~strikethrough~~ .\n\nShopping list:\n\n  * apples\n  * oranges\n  * pears\n\nNumbered list:\n\n  1. apples\n  2. oranges\n  3. pears\n\nThe rain---not the reign---in\nSpain.\n\n *[Herman Fassett](https://freecodecamp.com/hermanfassett)*'
		}

		this.handleRawChange = this.handleRawChange.bind(this);
	}

	handleRawChange(e) {
		this.setState({
			content: e.target.value
		})
	}

	createMarkup(content) { 
		return { 
			__html: marked(content)
		};
}

	render() {
		const { content } = this.state;
		const markedContent = this.createMarkup(content) //marked无效
		console.log(markedContent);
		return(
    	<div className='row' >
				<div className='col-md-6' >
        	<Raw content={content} onChange={this.handleRawChange} />  
				</div>
				<div className='col-md-6'>
					<Show content={markedContent} />
				</div>
   		</div>
  	)      
  }
}

const Raw = ({
	content,
	onChange
}) => (
  <textarea rows='30' cols='40' type='text' value={content} onChange={onChange} />
)

const Show = ({
	content
}) => (
	<span dangerouslySetInnerHTML={content} ></span>
)

ReactDOM.render(
  <Contain />,
  document.getElementById('root')
)
