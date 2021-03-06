'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var propTypes = {
    container: _propTypes2["default"].object,
    offsetTop: _propTypes2["default"].number,
    horizontal: _propTypes2["default"].bool,
    target: _propTypes2["default"].func, //不对外开放，获取滚动scroll以及resize功能
    onChange: _propTypes2["default"].func, //状态fixed或infixed时候调用
    onTargetChange: _propTypes2["default"].func, //功能只有一个，时时刻刻输出state的状态
    zIndex: _propTypes2["default"].number,
    canHidden: _propTypes2["default"].bool
};

var defaultProps = {
    offsetTop: 0,
    horizontal: false,
    container: document.body,
    target: function target() {
        return window;
    },
    onChange: function onChange(affixed) {
        return {};
    },
    onTargetChange: function onTargetChange(state) {
        return {};
    },
    zIndex: 2,
    canHidden: false
};

var Affix = function (_Component) {
    _inherits(Affix, _Component);

    function Affix(props) {
        _classCallCheck(this, Affix);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.getContainerDOM = function () {
            var container = _this.props.container;
            if (container != document.body) {
                return _reactDom2["default"].findDOMNode(container);
            }
            return container;
        };

        _this.getInitPosition = function () {
            var container = _this.getContainerDOM();
            var thisElm = _reactDom2["default"].findDOMNode(_this);

            _this.setState({
                height: thisElm.offsetHeight,
                width: thisElm.offsetWidth,
                containerHeight: container.offsetHeight,
                containerWidth: container.offsetWidth
            });
            var containerRect = container.getBoundingClientRect();
            var thisElemRect = thisElm.getBoundingClientRect();

            var top = thisElemRect.top,
                left = thisElemRect.left;

            var marginTop = top - containerRect.top;
            var marginLeft = left - containerRect.left;
            _this.setState({
                top: top,
                left: left,
                initTop: top,
                initLeft: left,
                marginTop: marginTop,
                marginLeft: marginLeft
            });
        };

        _this.handleTargetChange = function (evt) {
            var container = _this.getContainerDOM(); //是body

            var _container$getBoundin = container.getBoundingClientRect(),
                top = _container$getBoundin.top,
                left = _container$getBoundin.left;

            _this.setState({
                top: top + _this.state.marginTop, //=0是临界值，滚动条使得屏幕顶端正好在affix上面，前者一直变化后者为不变
                left: left + _this.state.marginLeft, //原理同上
                containerHeight: container.offsetHeight,
                containerWidth: container.offsetWidth
            });

            if (_this.state.top <= _this.props.offsetTop) {
                if (_this.state.affixed === false) {
                    _this.props.onChange({ affixed: true, event: evt });
                }
                _this.setState({ affixed: true }); //=true,calculate起作用
            }

            if (_this.state.top > _this.props.offsetTop) {
                if (_this.state.affixed === true) {
                    _this.props.onChange({ affixed: false, event: evt });
                    //新增还原样式
                }
                _this.setState({ affixed: false });
            }

            _this.props.onTargetChange(_this.state);
        };

        _this.calculate = function () {
            var fixStyle = {};
            var boxStyle = {};
            //20171102修改，添加(this.state.top - this.state.marginTop == 0)的判断，谨防height+offsetTop >= containerHeight, handleTargetChange中的
            //this.state.top <= this.props.offsetTop 恒成立，一直有position:affixed
            if (!_this.state.affixed || _this.state.top - _this.state.marginTop == 0) return { fixStyle: fixStyle, boxStyle: boxStyle };
            var h = _this.state.top - _this.state.marginTop + _this.state.containerHeight - _this.state.height;
            if (_this.state.top < _this.props.offsetTop) {
                fixStyle = {
                    position: "fixed",
                    //修改20171102 去掉展示Affix全部内容，若是Affix内容高度大于container可展示，那么Affix只可展示部分
                    top: _this.props.canHidden ? h < 0 ? h : Math.min(h, _this.props.offsetTop) : h < 0 ? 0 : Math.min(h, _this.props.offsetTop),
                    left: _this.props.horizontal ? _this.state.initLeft : _this.state.left,
                    height: _this.state.height,
                    width: _this.state.width,
                    zIndex: _this.props.zIndex
                };
                boxStyle = { height: _this.state.height };
            }
            return { fixStyle: fixStyle, boxStyle: boxStyle };
        };

        _this.state = {
            affixed: false,
            initTop: 0,
            initLeft: 0,
            top: 0, //affix距离顶部的距离
            left: 0, //affix距离左边的距离
            marginTop: 0, //top - containerTop
            marginLeft: 0, //left - containerLeft
            height: 0, //affix的高度
            width: 0, //affix的宽度
            containerHeight: 0, //container的高度
            containerWidth: 0 //container的宽度
        };
        _this.calculate = _this.calculate.bind(_this);
        _this.getInitPosition = _this.getInitPosition.bind(_this);
        _this.getContainerDOM = _this.getContainerDOM.bind(_this);
        _this.handleTargetChange = _this.handleTargetChange.bind(_this);
        return _this;
    }

    Affix.prototype.componentDidMount = function componentDidMount() {
        this.getInitPosition();
        var listenTarget = this.props.target();
        if (listenTarget) {
            listenTarget.addEventListener('resize', this.handleTargetChange);
            listenTarget.addEventListener('scroll', this.handleTargetChange);
        }
    };

    Affix.prototype.componentWillUnmount = function componentWillUnmount() {
        var listenTarget = this.props.target();
        if (listenTarget) {
            listenTarget.removeEventListener('scroll', this.handleTargetChange);
            listenTarget.removeEventListener('resize', this.handleTargetChange);
        }
    };

    /**
     * 获取container
     * @return {[type]} [description]
     */


    /**
     * 执行一次获取初始的位置，height,width,containerHeight，containerWidth,
     * initTop,initLeft，marginTop,marginLeft都是不变的
     * @return {[type]} [description]
     */


    /**
     * [description]主要用于处理scroll以及reseize事件重新计算布局
     * @param  {[object]} evt [scroll或者resize事件]
     * 有两个函数：onChange 和 onTargetChange;
     */


    /**
     * 只有上面的方法handleTargetChange使得affixed=ture才会执行
     * @return {[type]} [description]
     */


    Affix.prototype.render = function render() {
        var _calculate = this.calculate(),
            fixStyle = _calculate.fixStyle,
            boxStyle = _calculate.boxStyle;

        return _react2["default"].createElement(
            'div',
            { className: 'u-affix-container', id: 'u-affix-container', style: boxStyle },
            _react2["default"].createElement(
                'div',
                { className: 'u-affix-content', style: fixStyle },
                this.props.children
            )
        );
    };

    return Affix;
}(_react.Component);

Affix.propTypes = propTypes;

Affix.defaultProps = defaultProps;
exports["default"] = Affix;
module.exports = exports['default'];