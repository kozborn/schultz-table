import React from 'react';
import cn from 'classnames';
import { string, func, oneOf, node } from 'prop-types';

const Button = props =>
  (<button onClick={props.onClick} className={cn("btn", props.className, props.type, props.icon)}>
    {props.children}
  </button>);

const types = ['apply', 'clear', 'submit', 'delete'];

Button.propTypes = {
  type: oneOf(types),
  icon: oneOf(['', 'left', 'right']),
  onClick: func.isRequired,
  children: node.isRequired,
  className: string,
};

Button.defaultProps = {
  className: "",
  icon: '',
  type: 'apply',
};

export default Button;
