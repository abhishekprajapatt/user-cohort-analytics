import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  margin-bottom: 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #007bff;
  margin: 0;
  font-size: 1.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.active ? '#007bff' : '#666')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #007bff;
    background-color: #f8f9fa;
  }
`;

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Nav>
      <NavContainer>
        <Logo>Cohort Analytics</Logo>
        <NavLinks>
          <NavLink to="/" active={isActive('/')}>
            Dashboard
          </NavLink>
          <NavLink to="/users" active={isActive('/users')}>
            Users
          </NavLink>
          <NavLink to="/orders" active={isActive('/orders')}>
            Orders
          </NavLink>
          <NavLink to="/cohorts" active={isActive('/cohorts')}>
            Cohorts
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
