/**
*
* @title Affix
* @description 固定
*
*/

class Demo1 extends Component {
	render () {
			return (
				<div className="outer-box" id="outer-box">
					<label>基本的Affix，`container=tinperBeeDemo`</label>
					<Affix container={document.getElementById('tinperBeeDemo')}>
						<div className='content'>
								<span>affix</span>
						</div>
				  </Affix>
				</div>
			)
		}
}