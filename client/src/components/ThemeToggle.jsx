import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import styled from 'styled-components' 
import { useDashboardContext } from '../pages/layouts/DashboardLayout';

const ThemeToggle = () => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext();
  return (
    <ThemeToggleWrapper onClick={toggleDarkTheme}>
      {isDarkTheme ? (
        <BsFillSunFill className='toggle-icon' />
      ) : (
        <BsFillMoonFill />
      )}
    </ThemeToggleWrapper>
  )
}

const ThemeToggleWrapper = styled.div`
  background: transparent;
  border-color: transparent;
  width: 3.5rem;
  height: 2rem;
  display: grid;
  place-items: center;
  cursor: pointer;

  .toggle-icon {
    font-size: 1.15rem;
    color: var(--text-color);
  }
`;

export default ThemeToggle