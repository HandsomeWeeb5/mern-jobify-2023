import React from 'react'
import styled from 'styled-components'
import { Link, useRouteError } from 'react-router-dom'

import img from '../assets/not-found.svg'

const Error = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <StyledWrapper>
      <img src={img} alt="not found" />
      <h3>Ohh! page not found</h3>
      <p>We can't seem to find the page you're looking for</p>
      <Link to="/dashboard">back home</Link>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.main`
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 90vw;
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
    margin-top: -3rem;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    line-height: 1.5;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-secondary-color);
  }
  a {
    color: var(--primary-500);
    text-transform: capitalize;
  }
`

export default Error