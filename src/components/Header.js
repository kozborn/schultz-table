import React from 'react';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';
import { withRouter } from 'react-router';
import Hamburger from './common/Hamburger';
import logo from "../assets/logo.svg";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hamburgerExpanded: false,
    };

    this.toggleHamburgerMenu = this.toggleHamburgerMenu.bind(this);
  }

  toggleHamburgerMenu() {
    this.setState({hamburgerExpanded: !this.state.hamburgerExpanded});
  }

  renderHamburgerMenu() {
    return (<div className={'hamburger-menu'}>
      <div className={'menuItem'}>
        <Link to="/">Home page</Link>
      </div>
      <div className={'menuItem'}>
        <Link to={`/bottom-half-text${this.props.queryParams}`}>Dolna połowa tekstu</Link>
      </div>
      <div className={'menuItem'}>
        <Link to={`/top-half-text${this.props.queryParams}`}>Górna połowa tekstu</Link>
      </div>
      <div className={'menuItem'}>
        <Link to={`/schultz-table${this.props.queryParams}`}>Tabela Schultz'a</Link>
      </div>
      <div className={'menuItem'}>
        <Link to={`/fixations${this.props.queryParams}`}>Fiksacja</Link>
      </div>
      <div className={'menuItem'}>
        <Link to={`/user-texts${this.props.queryParams}`}>Twoje teksty</Link>
      </div>
      <div className={'menuItem'}>
        <Link className="settings" to={`/settings${this.props.queryParams}`}>Settings &#9881;</Link>
      </div>
    </div>);
  }

  render() {
    console.log(this.props)
    return (
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <nav className="navigation-top">
          <li><Link to="/">Home page</Link></li>
          <li><Link to={`/bottom-half-text${this.props.queryParams}`}>Dolna połowa tekstu</Link></li>
          <li><Link to={`/top-half-text${this.props.queryParams}`}>Górna połowa tekstu</Link></li>
          <li><Link to={`/schultz-table${this.props.queryParams}`}>Tabela Schultz'a</Link></li>
          <li><Link to={`/fixations${this.props.queryParams}`}>Fiksacja</Link></li>
          <li><Link to={`/user-texts${this.props.queryParams}`}>Twoje teksty</Link></li>
          <li>
            <Link className="settings" to={`/settings${this.props.queryParams}`}>&#9881;</Link>
          </li>
        </nav>
        <Hamburger
          className={'hamburger'}
          onClick={this.toggleHamburgerMenu}
        />
        {this.state.hamburgerExpanded && this.renderHamburgerMenu()}
      </header>
    );
  }
}

Header.propTypes = {
  queryParams: string.isRequired,
};

export default withRouter(Header);
